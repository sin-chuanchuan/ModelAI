from celery import shared_task
from typing import Dict, Any, Optional
from datetime import datetime
from bson import ObjectId
import asyncio
import logging

from app.services.ai.factory import AIServiceFactory
from app.utils.database import generation_tasks_collection, materials_collection
from app.models.task import TaskStatus
from celery_config import celery

logger = logging.getLogger(__name__)

@celery.task(
    bind=True, 
    name="app.tasks.generate.generate_image_task",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=600,
    max_retries=3
)
def generate_image_task(self, task_id: str):
    """
    Celery task for generating an image asynchronously.
    Supports asynchronous AI service calls within the synchronous Celery worker.
    """
    import os
    logger.info(f"Start processing generation task: {task_id}")
    
    # 0. 环境变量校验 (线上诊断关键)
    api_key = os.getenv("DOUBAO_API_KEY")
    if not api_key:
        error_msg = "CRITICAL: DOUBAO_API_KEY is missing in environment variables"
        logger.error(error_msg)
        generation_tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {"status": TaskStatus.FAILED, "error_message": error_msg, "updated_at": datetime.utcnow()}}
        )
        return

    # 1. 获取任务数据
    task = generation_tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        logger.error(f"Task {task_id} not found in database.")
        return

    # 2. 更新状态为正在处理 (解决前端无限 Loading)
    generation_tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {
            "status": TaskStatus.PROCESSING, 
            "progress": 10, 
            "updated_at": datetime.utcnow()
        }}
    )
    
    try:
        # 3. 准备 AI 服务
        service_name = task.get("service", "doubao") 
        ai_service = AIServiceFactory.get_service(service_name)
        
        # 4. 解析素材 ID 为 URL
        garment_url = task.get("garment_url")
        reference_image_url = task.get("reference_image_url")
        
        # 如果有直接提供的参考图 URL，优先使用
        model_url = reference_image_url
        scene_url = None

        def resolve_material_url(material_id_or_url):
            if not material_id_or_url:
                return None
            if ObjectId.is_valid(str(material_id_or_url)):
                m_doc = materials_collection.find_one({"_id": ObjectId(material_id_or_url)})
                return m_doc.get("url") if m_doc else material_id_or_url
            return material_id_or_url

        # 如果没有 reference_image_url，回退到 legacy 的 model_id/scene_id 逻辑
        if not model_url:
            model_id = task.get("model_id")
            scene_id = task.get("scene_id")
            model_url = resolve_material_url(model_id)
            scene_url = resolve_material_url(scene_id)

        # 5. 处理本地开发 URL 兼容性 (豆包 API 限制)
        def get_public_url(url):
            if not url: return None
            # 豆包 API 只能访问带有公网域名且 HTTPS 的 URL
            # 如果是本地路径、相对路径或 localhost，统一转发到示例图
            is_local = "localhost" in url or "127.0.0.1" in url or "file://" in url
            is_relative = url.startswith("/") and not url.startswith("//")
            is_not_https = not url.startswith("https://")
            
            if is_local or is_relative or is_not_https:
                # 生产环境下应上传至 OSS/S3，开发环境下使用示例图
                logger.warning(f"Map internal URL to public placeholder: {url}")
                return "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png"
            return url

        image_urls_list = []
        if model_url: image_urls_list.append(get_public_url(model_url)) # Index 0 -> 图片1
        if garment_url: image_urls_list.append(get_public_url(garment_url)) # Index 1 -> 图片2
        if scene_url: image_urls_list.append(get_public_url(scene_url)) # Index 2 -> 图片3
        
        # 5. 设计高保真换装 Prompt
        # 对于豆包 Seedream 4.5，指令式的 Prompt 在多图场景下效果最好
        if garment_url and model_url:
            # 基础换装指令
            base_prompt = "将图片1中的模特穿上图片2中的服装。"
            # 稳定性约束
            stability_constraints = "必须严格保持图片1中模特的面部特征、发型、五官和妆容，且背景环境保持完全一致。"
            # 质量描述
            quality_tags = "专业高端电商商拍图，高质量保真，细腻的织物纹理，柔和自然的商业摄影光影，8K超清，极致细节。"
            
            # 组合 Prompt
            default_vto_prompt = f"{base_prompt} {stability_constraints} {quality_tags}"
            prompt = task.get("prompt") or default_vto_prompt
        else:
            prompt = task.get("prompt") or "A professional fashion photo of a model wearing high-quality clothing"
        
        # 6. 执行异步 AI 生成逻辑
        # 因为 Celery worker 是同步运行的，我们需要通过事件循环运行异步代码
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
        logger.info(f"Starting image generation for task {task_id} using {service_name}")
        
        result = loop.run_until_complete(ai_service.generate_image(
            prompt=prompt,
            image_urls={"list": image_urls_list}, # Pass as list wrapped in dict for current API compatibility
            size=task.get("params", {}).get("size", "2K")
        ))
        
        # 7. 更新结果到数据库
        generation_tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {
                "status": TaskStatus.COMPLETED, 
                "progress": 100, 
                "result_url": result.get("image_url"), 
                "completed_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        logger.info(f"Task {task_id} completed successfully.")
        
    except Exception as e:
        error_msg = str(e)
        logger.exception(f"Error executing generation task {task_id}: {error_msg}")
        # 8. 标记任务失败
        generation_tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {
                "status": TaskStatus.FAILED, 
                "error_message": error_msg,
                "updated_at": datetime.utcnow()
            }}
        )
        # Re-raise as a simple Exception to avoid pickling issues with complex objects
        raise Exception(error_msg)