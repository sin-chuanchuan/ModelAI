from typing import Dict, Any, Optional
import httpx
import os
import logging

from app.services.ai.base import AIService
from config import config

logger = logging.getLogger(__name__)

class DoubaoAIService(AIService):
    """豆包文生图模型服务实现。"""
    
    def __init__(self):
        """初始化豆包服务。"""
        # 优先从环境变量读取，否则从配置文件读取
        self.api_key = os.getenv("DOUBAO_API_KEY") or config.DOUBAO_API_KEY
        if not self.api_key:
            logger.warning("DOUBAO_API_KEY is not set!")
            
        self.api_url = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
        self.model = "doubao-seedream-4-5-251128"
    
    async def generate_image(
        self,
        prompt: str,
        image_urls: Optional[Dict[str, str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        使用豆包文生图模型生成图片。
        
        Args:
            prompt: 生成图片的提示词。
            image_urls: 参考图片URL字典（可选）。
            **kwargs: 额外的API参数。
        
        Returns:
            包含生成图片URL和元数据的字典。
        """
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        request_data = {
            "model": self.model,
            "prompt": prompt,
            "sequential_image_generation": "disabled",
            "response_format": "url",
            "size": kwargs.get("size", "2K"),
            "stream": False,
            "watermark": kwargs.get("watermark", True)
        }
        
        if image_urls:
            request_data["image"] = list(image_urls.values())
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(self.api_url, headers=headers, json=request_data)
                
                if response.status_code != 200:
                    logger.error(f"Doubao API Error: {response.status_code} - {response.text}")
                    response.raise_for_status()
                
                result = response.json()
                
                return {
                    "image_url": result["data"][0]["url"],
                    "model": self.model,
                    "size": request_data["size"],
                    "quality": kwargs.get("quality", "standard"),
                    "prompt": prompt
                }
        except httpx.HTTPError as e:
            logger.exception(f"HTTP error occurred while calling Doubao API: {e}")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in DoubaoAIService: {e}")
            raise
    
    def get_name(self) -> str:
        """获取服务名称。"""
        return "doubao"