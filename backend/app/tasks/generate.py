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

@celery.task(bind=True, name="app.tasks.generate.generate_image_task")
def generate_image_task(self, task_id: str):
    """
    Celery task for generating an image asynchronously.
    Supports asynchronous AI service calls within the synchronous Celery worker.
    """
    # 1. 获取任务数据
    task = generation_tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        logger.error(f"Task {task_id} not found in database.")
        return

    # 2. 更新状态为正在处理
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
        model_id = task.get("model_id")
        scene_id = task.get("scene_id")
        garment_url = task.get("garment_url")

        def resolve_material_url(material_id_or_url):
            if not material_id_or_url:
                return None
            if ObjectId.is_valid(str(material_id_or_url)):
                m_doc = materials_collection.find_one({"_id": ObjectId(material_id_or_url)})
                return m_doc.get("url") if m_doc else material_id_or_url
            return material_id_or_url

        model_url = resolve_material_url(model_id)
        scene_url = resolve_material_url(scene_id)

        # 5. 处理本地开发 URL 兼容性 (豆包 API 限制)
        def get_public_url(url):
            if not url: return None
            if url.startswith("file://") or "localhost" in url:
                # 生产环境下应上传至 OSS/S3，开发环境下使用示例图
                return "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png"
            return url

        image_urls = {}
        if garment_url: image_urls["garment"] = get_public_url(garment_url)
        if model_url: image_urls["model"] = get_public_url(model_url)
        if scene_url: image_urls["scene"] = get_public_url(scene_url)
        
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
            image_urls=image_urls,
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
        logger.exception(f"Error executing generation task {task_id}: {str(e)}")
        # 8. 标记任务失败
        generation_tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {"$set": {
                "status": TaskStatus.FAILED, 
                "error_message": str(e),
                "updated_at": datetime.utcnow()
            }}
        )
        raise e