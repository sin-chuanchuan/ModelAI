from typing import Dict, Any, Tuple
from app.services.content_safety.base import ContentSafetyService

class BasicContentSafetyService(ContentSafetyService):
    """Basic content safety service implementation using keyword filtering."""
    
    def __init__(self):
        """Initialize the basic content safety service with a list of unsafe keywords."""
        # Basic list of unsafe keywords - this should be expanded with more comprehensive lists
        self.unsafe_keywords = {
            # Violence and harmful content
            "violence", "kill", "murder", "assault", "weapon", "gun", "bomb", "explosive",
            
            # Adult and explicit content
            "porn", "sex", "nude", "explicit", "adult", "sexual", "erotic",
            
            # Hate speech and discrimination
            "hate", "racist", "nazi", "bigot", "discriminate", "prejudice",
            
            # Illegal activities
            "illegal", "drug", "marijuana", "cocaine", "heroin", "steal", "robbery",
            
            # Harmful instructions
            "suicide", "self-harm", "harm", "poison", "toxic", "dangerous",
        }
    
    async def check_prompt(self, prompt: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Check if a prompt is safe using keyword filtering.
        
        Args:
            prompt: The text prompt to check.
        
        Returns:
            A tuple containing:
            - is_safe: True if the prompt is safe, False otherwise.
            - details: A dictionary containing safety check details.
        """
        # Convert prompt to lowercase for case-insensitive checking
        prompt_lower = prompt.lower()
        
        # Check for unsafe keywords
        detected_keywords = []
        for keyword in self.unsafe_keywords:
            if keyword in prompt_lower:
                detected_keywords.append(keyword)
        
        # Determine if prompt is safe
        is_safe = len(detected_keywords) == 0
        
        # Create details dictionary
        details = {
            "is_safe": is_safe,
            "detected_keywords": detected_keywords,
            "prompt_length": len(prompt),
            "service": "basic_keyword_filter",
        }
        
        return is_safe, details
    
    async def check_image(self, image_url: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Basic image safety check (placeholder implementation).
        
        Args:
            image_url: The URL of the image to check.
        
        Returns:
            A tuple containing:
            - is_safe: True if the image is assumed safe (basic implementation), False otherwise.
            - details: A dictionary containing safety check details.
        """
        # Basic implementation - always returns safe
        # This should be replaced with a real image moderation service
        return True, {
            "is_safe": True,
            "service": "basic_image_check",
            "image_url": image_url,
            "message": "Basic image safety check: Image assumed safe (implementation placeholder)",
        }