from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional
from datetime import datetime
from bson import ObjectId

from app.deps import get_current_user
from app.schemas.user import UserInDB
from app.models.task import GenerationTaskModel, TaskStatus
from app.utils.database import generation_tasks_collection
# Import celery task
from app.tasks.generate import generate_image_task

router = APIRouter(
    tags=["generate"]
)

@router.post("/", response_model=GenerationTaskModel)
async def create_generation_task(
    request: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user),
):
    """
    Create a new generation task.
    """
    # Validate basics
    garment_url = request.get("garment_url")
    model_id = request.get("model_id")
    scene_id = request.get("scene_id")
    
    if not garment_url or not model_id or not scene_id:
         raise HTTPException(status_code=400, detail="Missing garment_url, model_id or scene_id")

    # Construct Prompt (Simplified logic for now)
    # In real app, we would fetch model/scene details to build prompt
    prompt = f"Model {model_id} wearing garment in scene {scene_id}"
    
    # Create Task Record
    task = GenerationTaskModel(
        user_id=current_user.id,
        garment_url=garment_url,
        model_id=model_id,
        scene_id=scene_id,
        pose_id=request.get("pose_id"),
        prompt=prompt,
        status=TaskStatus.PENDING
    )
    
    result = generation_tasks_collection.insert_one(task.model_dump(by_alias=True, exclude={"id"}))
    task.id = str(result.inserted_id)
    
    # Trigger Celery Task
    generate_image_task.delay(str(task.id))
    
    return task

@router.get("/{task_id}", response_model=GenerationTaskModel)
async def get_task_status(
    task_id: str,
    current_user: UserInDB = Depends(get_current_user),
):
    """Get status of a specific task."""
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=400, detail="Invalid task ID")
        
    doc = generation_tasks_collection.find_one({
        "_id": ObjectId(task_id),
        "user_id": current_user.id
    })
    
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")
        
    return GenerationTaskModel(**doc)