from fastapi import APIRouter, HTTPException, status, Body
from typing import Dict, Any, Optional
from app.utils.database import generation_tasks_collection
from bson import ObjectId

router = APIRouter(
    tags=["generate"]
)


@router.post("/image/doubao", response_model=Dict[str, Any])
async def generate_image_doubao(
    request: Dict[str, Any]
):
    """
    Direct API endpoint for testing Doubao image generation without Celery.
    
    Args:
        request: JSON request body containing:
            - prompt: The text prompt to generate the image from.
            - image_urls: Optional dictionary of reference images.
            - size: The size of the generated image (default: "2K").
            - watermark: Whether to add watermark to the generated image (default: True).
    
    Returns:
        A dictionary containing the generated image URL and metadata.
    """
    try:
        from app.services.ai.factory import AIServiceFactory
        
        # Extract parameters from request body
        prompt = request.get("prompt")
        image_urls = request.get("image_urls")
        size = request.get("size", "2K")
        watermark = request.get("watermark", True)
        
        if not prompt:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Prompt is required"
            )
        
        # Get the Doubao AI service instance
        ai_service = AIServiceFactory.get_service("doubao")
        
        # Generate the image
        result = await ai_service.generate_image(
            prompt=prompt,
            image_urls=image_urls,
            size=size,
            watermark=watermark
        )
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate image: {str(e)}"
        )