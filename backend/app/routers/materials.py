from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.deps import get_current_user
from app.schemas.user import UserInDB
from app.models.material import MaterialModel, MaterialType
from app.utils.database import materials_collection
from app.services.storage.factory import StorageServiceFactory
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["materials"]
)

@router.get("/presets", response_model=List[MaterialModel])
async def get_presets(
    category: Optional[MaterialType] = None,
):
    """Get all preset materials (public)."""
    filter_query = {"is_public": True}
    if category:
        filter_query["type"] = category
        
    cursor = materials_collection.find(filter_query)
    materials = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        materials.append(MaterialModel(**doc))
    return materials

@router.get("/mine", response_model=List[MaterialModel])
async def get_my_materials(
    current_user: UserInDB = Depends(get_current_user),
    category: Optional[MaterialType] = None,
):
    """Get user's uploaded materials."""
    filter_query = {"owner_id": current_user.id}
    if category:
        filter_query["type"] = category
        
    cursor = materials_collection.find(filter_query)
    materials = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        materials.append(MaterialModel(**doc))
    return materials

@router.post("/upload", response_model=MaterialModel)
async def upload_material(
    file: UploadFile = File(...),
    type: MaterialType = Form(...),
    name: Optional[str] = Form(None),
    current_user: UserInDB = Depends(get_current_user),
):
    """Upload a new material (garment, model, or scene)."""
    logger.info(f"User {current_user.id} uploading {type}: {file.filename}")
    
    storage = StorageServiceFactory.get_service()
    
    try:
        # Generate generic filename structure
        filename = f"{current_user.id}/{file.filename}"

        # Upload using the storage service
        url = await storage.upload_file(
            file.file, 
            filename, 
            content_type=file.content_type,
            file_type="upload"
        )
        
        # Create DB entry
        material_data = {
            "type": type,
            "name": name or file.filename,
            "url": url,
            "owner_id": current_user.id,
            "is_public": False,
            "created_at": datetime.utcnow()
        }
        
        result = materials_collection.insert_one(material_data)
        
        return MaterialModel(
            id=str(result.inserted_id),
            **material_data
        )
    except Exception as e:
        logger.exception(f"Failed to upload material: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )
