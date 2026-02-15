from typing import Dict, Any, Optional
import openai
import os
import logging

from app.services.ai.base import AIService
from config import config

logger = logging.getLogger(__name__)

class OpenAIService(AIService):
    """OpenAI/Doubao AI service implementation using AsyncOpenAI client."""
    
    def __init__(self):
        """Initialize the AI service with async client based on configuration."""
        self.provider = getattr(config, "AI_PROVIDER", "openai")
        self.api_key = None
        self.base_url = None
        self.model = "dall-e-3" # Default

        if self.provider == "doubao":
            self.api_key = os.getenv("DOUBAO_API_KEY") or getattr(config, "DOUBAO_API_KEY", None)
            self.base_url = getattr(config, "DOUBAO_BASE_URL", "https://ark.cn-beijing.volces.com/api/v3")
            # Doubao (Ark) uses Endpoint ID as model name
            self.model = os.getenv("DOUBAO_MODEL") or getattr(config, "DOUBAO_MODEL", None)
            if not self.model:
                 logger.warning("DOUBAO_MODEL (Endpoint ID) is not set! Image generation may fail.")
            if not self.api_key:
                logger.warning("DOUBAO_API_KEY is not set!")
        else:
            # Default to OpenAI
            self.api_key = os.getenv("OPENAI_API_KEY") or getattr(config, "OPENAI_API_KEY", None)
            if not self.api_key:
                logger.warning("OPENAI_API_KEY is not set!")
            
        self.client = openai.AsyncOpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        ) if self.api_key else None
    
    async def generate_image(
        self,
        prompt: str,
        image_urls: Optional[Dict[str, str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate an image using OpenAI-compatible API (OpenAI DALL-E 3 or Doubao/Ark).
        
        Args:
            prompt: The text prompt to generate the image from.
            image_urls: Optional dictionary of reference images.
            **kwargs: Additional parameters for the OpenAI API.
        
        Returns:
            A dictionary containing the generated image URL and other metadata.
        """
        # Prepare extra body for Doubao multi-image support
        extra_body = {}
        if self.provider == "doubao" and image_urls:
            if isinstance(image_urls, dict) and "list" in image_urls:
                extra_body["image"] = image_urls["list"]
            else:
                extra_body["image"] = list(image_urls.values())

        # Default parameters
        size = kwargs.get("size", "1024x1024")
        if self.provider == "doubao":
            # Map common presets to pixels for Doubao SDK
            size_map = {
                "2K": "2048x2048",
                "4K": "4096x4096",
                "standard": "2048x2048"
            }
            size = size_map.get(size, size)
            if size == "1024x1024": # Fallback if default was used
                size = "2048x2048"
        quality = kwargs.get("quality", "standard")
        n = kwargs.get("n", 1)
        # Use configured model or fallback 'dall-e-3' or override from kwargs
        model = kwargs.get("model", self.model or "dall-e-3")
        
        try:
            logger.info(f"Generating image with prompt: {prompt[:50]}... using model: {model}")
            response = await self.client.images.generate(
                model=model,
                prompt=prompt,
                size=size,
                quality=quality,
                n=n,
                extra_body=extra_body if extra_body else None
            )
            
            return {
                "image_url": response.data[0].url,
                "model": model,
                "size": size,
                "quality": quality,
                "prompt": prompt
            }
        except openai.OpenAIError as e:
            logger.error(f"{self.provider.upper()} API Error: {str(e)}")
            raise
        except Exception as e:
            logger.exception(f"Unexpected error in OpenAIService: {str(e)}")
            raise
    
    def get_name(self) -> str:
        """Get the name of the AI service."""
        return self.provider