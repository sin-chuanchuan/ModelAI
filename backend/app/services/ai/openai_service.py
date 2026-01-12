from typing import Dict, Any, Optional
import openai
from dotenv import load_dotenv
import os

from app.services.ai.base import AIService

# Load environment variables
load_dotenv()

class OpenAIService(AIService):
    """OpenAI DALL-E 3 service implementation."""
    
    def __init__(self):
        """Initialize the OpenAI service."""
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        
        openai.api_key = self.api_key
    
    async def generate_image(
        self,
        prompt: str,
        image_urls: Optional[Dict[str, str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate an image using OpenAI DALL-E 3.
        
        Args:
            prompt: The text prompt to generate the image from.
            image_urls: Optional dictionary of reference images.
            **kwargs: Additional parameters for the OpenAI API.
        
        Returns:
            A dictionary containing the generated image URL and other metadata.
        """
        # For now, we'll use the basic prompt without reference images
        # since DALL-E 3 doesn't directly support image input via API
        # We'll enhance the prompt with details from the reference images later
        
        # Default parameters
        size = kwargs.get("size", "1024x1024")
        quality = kwargs.get("quality", "standard")
        n = kwargs.get("n", 1)
        
        # Call OpenAI API
        response = openai.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size=size,
            quality=quality,
            n=n,
        )
        
        # Return the generated image URL and metadata
        return {
            "image_url": response.data[0].url,
            "model": "dall-e-3",
            "size": size,
            "quality": quality,
            "prompt": prompt
        }
    
    def get_name(self) -> str:
        """Get the name of the AI service."""
        return "openai"