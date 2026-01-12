from typing import Dict, Any, Optional
import requests
from dotenv import load_dotenv
import os

from app.services.ai.base import AIService

# Load environment variables
load_dotenv()

class DoubaoAIService(AIService):
    """豆包文生图模型服务实现。"""
    
    def __init__(self):
        """初始化豆包服务。"""
        self.api_key = os.getenv("DOUBAO_API_KEY") or "0f1ecca0-9024-461c-8a5a-2cd50679db48"
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
        # 准备请求头
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        # 准备请求体
        request_data = {
            "model": self.model,
            "prompt": prompt,
            "sequential_image_generation": "disabled",
            "response_format": "url",
            "size": kwargs.get("size", "2K"),
            "stream": False,
            "watermark": kwargs.get("watermark", True)
        }
        
        # 如果有参考图片，添加到请求中
        if image_urls:
            # 将字典转换为列表，豆包API期望的格式
            request_data["image"] = list(image_urls.values())
        
        # 发送请求
        response = requests.post(self.api_url, headers=headers, json=request_data)
        response.raise_for_status()
        
        # 处理响应
        result = response.json()
        
        # 返回结果
        return {
            "image_url": result["data"][0]["url"],
            "model": self.model,
            "size": request_data["size"],
            "quality": kwargs.get("quality", "standard"),
            "prompt": prompt
        }
    
    def get_name(self) -> str:
        """获取服务名称。"""
        return "doubao"