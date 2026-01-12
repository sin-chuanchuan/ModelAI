from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class AIService(ABC):
    """Abstract base class for AI services."""
    
    @abstractmethod
    async def generate_image(
        self,
        prompt: str,
        image_urls: Optional[Dict[str, str]] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate an image based on the given prompt and optional reference images.
        
        Args:
            prompt: The text prompt to generate the image from.
            image_urls: Optional dictionary of reference images (e.g., {"clothing": "url1", "model": "url2"}).
            **kwargs: Additional parameters for the AI service.
        
        Returns:
            A dictionary containing the generated image URL and other metadata.
        """
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """Get the name of the AI service."""
        pass