from fastapi import APIRouter, HTTPException, status, UploadFile, File
from typing import Optional, Dict, Any
from pydantic import BaseModel
from PIL import Image
import io

from app.services.image_preprocessing import (
    preprocess_image,
    image_to_base64,
    base64_to_image
)
from app.services.storage.factory import StorageServiceFactory

router = APIRouter(
    prefix="/image",
    tags=["image"]
)

class PreprocessImageRequest(BaseModel):
    """Request model for preprocessing an image."""
    image: str  # Base64 encoded image
    resize: Optional[Dict[str, int]] = None  # {"width": 1024, "height": 1024}
    crop: Optional[Dict[str, int]] = None  # {"left": 0, "upper": 0, "right": 500, "lower": 500}
    remove_bg: bool = False
    brightness: Optional[float] = None
    contrast: Optional[float] = None
    saturation: Optional[float] = None

class PreprocessImageResponse(BaseModel):
    """Response model for preprocessing an image."""
    image: str  # Base64 encoded preprocessed image

@router.post("/preprocess", response_model=PreprocessImageResponse)
async def preprocess_image_api(request: PreprocessImageRequest):
    """
    Preprocess an image with the specified operations.
    
    Args:
        request: The request containing the image and preprocessing parameters.
    
    Returns:
        A response containing the preprocessed image.
    """
    try:
        # Convert base64 string to image
        image = base64_to_image(request.image)
        
        # Prepare preprocessing parameters
        resize = None
        if request.resize:
            resize = (request.resize["width"], request.resize["height"])
        
        crop = None
        if request.crop:
            crop = (
                request.crop["left"],
                request.crop["upper"],
                request.crop["right"],
                request.crop["lower"]
            )
        
        # Preprocess the image
        preprocessed_image = preprocess_image(
            image=image,
            resize=resize,
            crop=crop,
            remove_bg=request.remove_bg,
            brightness=request.brightness,
            contrast=request.contrast,
            saturation=request.saturation
        )
        
        # Convert preprocessed image to base64
        preprocessed_image_base64 = image_to_base64(preprocessed_image)
        
        return PreprocessImageResponse(image=preprocessed_image_base64)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to preprocess image: {str(e)}"
        )

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image to storage and return its URL.
    
    Args:
        file: The uploaded image file.
    
    Returns:
        A response containing the URL of the uploaded image.
    """
    try:
        # Get storage service instance
        storage_service = StorageServiceFactory.get_service()
        
        # Read the image file
        contents = await file.read()
        
        # Upload to storage
        file_obj = io.BytesIO(contents)
        file_url = await storage_service.upload_file(
            file_obj=file_obj,
            file_name=file.filename,
            content_type=file.content_type,
            file_type="upload"
        )
        
        return {"image_url": file_url}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )