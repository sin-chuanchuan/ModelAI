from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Tuple

class ContentSafetyService(ABC):
    """Abstract base class for content safety services."""
    
    @abstractmethod
    async def check_prompt(self, prompt: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Check if a prompt is safe for generating images.
        
        Args:
            prompt: The text prompt to check.
        
        Returns:
            A tuple containing:
            - is_safe: True if the prompt is safe, False otherwise.
            - details: A dictionary containing safety check details.
        """
        pass
    
    @abstractmethod
    async def check_image(self, image_url: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Check if an image is safe.
        
        Args:
            image_url: The URL of the image to check.
        
        Returns:
            A tuple containing:
            - is_safe: True if the image is safe, False otherwise.
            - details: A dictionary containing safety check details.
        """
        pass