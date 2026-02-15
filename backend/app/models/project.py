from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class ProjectStatus(str, Enum):
    DRAFT = "DRAFT"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

class ProjectModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., description="Owner User ID")
    name: str = Field(..., description="Project Name e.g. '2024 Summer Collection'")
    
    # Core Workflow Configuration
    selected_path: str = Field(..., description="Workflow path: 'history' or 'platform'")
    
    # Collections
    garment_urls: List[str] = Field(default=[], description="List of garment image URLs to be processed")
    reference_photo_ids: List[str] = Field(default=[], description="Selected reference photo IDs")
    
    # Results
    generated_task_ids: List[str] = Field(default=[], description="IDs of generation tasks created for this project")
    
    status: ProjectStatus = Field(default=ProjectStatus.DRAFT)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
