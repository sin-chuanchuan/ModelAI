from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from enum import Enum
from datetime import datetime
from bson import ObjectId
from app.models.user import PyObjectId

class TaskStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class GenerationTaskModel(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId = Field(..., description="User ID")
    project_id: Optional[PyObjectId] = Field(None, description="Project ID if part of a project")
    
    # Inputs - New Workflow
    garment_url: str
    reference_image_url: Optional[str] = None # Key input for new workflow
    workflow_type: Optional[str] = Field(None, description="replace_garment (history) or generate_new (platform)")
    
    # Inputs - Legacy (Keep for backward compatibility if needed, or deprecate)
    model_id: Optional[str] = None
    scene_id: Optional[str] = None
    pose_id: Optional[str] = None
    prompt: Optional[str] = None 
    
    # Outputs
    result_url: Optional[str] = None
    error_message: Optional[str] = None
    
    # Meta
    status: TaskStatus = Field(default=TaskStatus.PENDING)
    progress: int = Field(default=0, ge=0, le=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
