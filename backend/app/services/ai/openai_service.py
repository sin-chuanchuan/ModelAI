from typing import Dict, Any, Optional
import openai
import os
import logging

from app.services.ai.base import AIService
from config import config

logger = logging.getLogger(__name__)

class OpenAIService(AIService):
    """OpenAI DALL-E 3 service implementation using AsyncOpenAI."""
    
    def __init__(self):
        """Initialize the OpenAI service with async client."""
        # 优先从环境变量读取，其次从 config 模块读取
        self.api_key = os.getenv("OPENAI_API_KEY") or getattr(config, "OPENAI_API_KEY", None)
        if not self.api_key:
            logger.warning("OPENAI_API_KEY is not set!")
            
        self.client = openai.AsyncOpenAI(api_key=self.api_key) if self.api_key else None
    
    async def generate_image(
        self,
        prompt: str,
        image_urls: Optional[Dict[str, str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate an image using OpenAI DALL-E 3 asynchronously.
        
        Args:
            prompt: The text prompt to generate the image from.
            image_urls: Optional dictionary of reference images.
            **kwargs: Additional parameters for the OpenAI API.
        
        Returns:
            A dictionary containing the generated image URL and other metadata.
        """
        if not self.client:
            raise ValueError("OpenAI client not initialized. Check your API key.")

        # Default parameters
        size = kwargs.get("size", "1024x1024")
        quality = kwargs.get("quality", "standard")
        n = kwargs.get("n", 1)
        
        try:
            logger.info(f"Generating image with prompt: {prompt[:50]}...")
            response = await self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size=size,
                quality=quality,
                n=n,
            )
            
            return {
                "image_url": response.data[0].url,
                "model": "dall-e-3",
                "size": size,
                "quality": quality,
                "prompt": prompt
            }
        except openai.OpenAIError as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in OpenAIService: {str(e)}")
            raise
    
    def get_name(self) -> str:
        """Get the name of the AI service."""
        return "openai"