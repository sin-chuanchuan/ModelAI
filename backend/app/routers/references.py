from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.deps import get_current_user
from app.schemas.user import UserInDB
from app.models.reference import ReferencePhotoModel, ReferenceType
from app.utils.database import references_collection
from app.services.storage.factory import StorageServiceFactory
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["references"]
)

@router.get("/presets", response_model=List[ReferencePhotoModel], response_model_by_alias=False)
async def get_presets(
    tags: Optional[str] = None,
):
    """Get platform preset reference photos."""
    filter_query = {"type": ReferenceType.PLATFORM_PRESET, "is_public": True}
    if tags:
        tag_list = [t.strip() for t in tags.split(",")]
        filter_query["tags"] = {"$in": tag_list}
        
    cursor = references_collection.find(filter_query)
    refs = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        # Ensure url is present
        if "url" not in doc:
             continue
        refs.append(ReferencePhotoModel(**doc))
    return refs

@router.get("/mine", response_model=List[ReferencePhotoModel], response_model_by_alias=False)
async def get_my_references(
    current_user: UserInDB = Depends(get_current_user),
):
    """Get user's uploaded history reference photos."""
    filter_query = {"owner_id": current_user.id, "type": ReferenceType.USER_HISTORY}
    
    cursor = references_collection.find(filter_query).sort("created_at", -1)
    refs = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        refs.append(ReferencePhotoModel(**doc))
    return refs

@router.post("/upload", response_model=ReferencePhotoModel, response_model_by_alias=False)
async def upload_reference(
    file: UploadFile = File(...),
    tags: Optional[str] = Form(None), # Comma separated
    current_user: UserInDB = Depends(get_current_user),
):
    """Upload a new reference photo (History)."""
    logger.info(f"User {current_user.id} uploading reference: {file.filename}")
    
    storage = StorageServiceFactory.get_service()
    
    try:
        # Generate generic filename structure
        filename = f"{current_user.id}/refs/{file.filename}"

        # Upload using the storage service
        url = await storage.upload_file(
            file.file, 
            filename, 
            content_type=file.content_type,
            file_type="reference_upload"
        )
        
        tag_list = [t.strip() for t in tags.split(",")] if tags else []
        
        # Create DB entry
        ref_data = {
            "type": ReferenceType.USER_HISTORY,
            "url": url,
            "owner_id": current_user.id,
            "is_public": False,
            "tags": tag_list,
            "created_at": datetime.utcnow()
        }
        
        result = references_collection.insert_one(ref_data)
        
        return ReferencePhotoModel(
            id=str(result.inserted_id),
            **ref_data
        )
    except Exception as e:
        logger.exception(f"Failed to upload reference: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )
