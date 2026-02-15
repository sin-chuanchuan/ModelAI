from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.deps import get_current_user
from app.schemas.user import UserInDB
from app.models.project import ProjectModel, ProjectStatus
from app.models.task import GenerationTaskModel, TaskStatus
from app.utils.database import projects_collection, generation_tasks_collection
from app.tasks.generate import generate_image_task
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["projects"]
)

@router.post("/", response_model=ProjectModel, response_model_by_alias=False)
async def create_project(
    name: str = Body(..., embed=True),
    selected_path: str = Body(..., embed=True), # 'history' or 'platform'
    current_user: UserInDB = Depends(get_current_user),
):
    """Create a new seasonal project."""
    project = ProjectModel(
        user_id=current_user.id,
        name=name,
        selected_path=selected_path,
        status=ProjectStatus.DRAFT
    )
    
    result = projects_collection.insert_one(project.model_dump(by_alias=True, exclude={"id"}))
    project.id = str(result.inserted_id)
    return project

@router.get("/", response_model=List[ProjectModel], response_model_by_alias=False)
async def list_projects(
    current_user: UserInDB = Depends(get_current_user),
):
    """List all projects for the current user."""
    cursor = projects_collection.find({"user_id": current_user.id}).sort("updated_at", -1)
    projects = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        projects.append(ProjectModel(**doc))
    return projects

@router.get("/{project_id}", response_model=ProjectModel, response_model_by_alias=False)
async def get_project(
    project_id: str,
    current_user: UserInDB = Depends(get_current_user),
):
    """Get a specific project."""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    doc = projects_collection.find_one({
        "_id": ObjectId(project_id),
        "user_id": current_user.id
    })
    
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
        
    doc["id"] = str(doc["_id"])
    return ProjectModel(**doc)

@router.post("/{project_id}/garments", response_model=ProjectModel, response_model_by_alias=False)
async def add_garments(
    project_id: str,
    garment_urls: List[str] = Body(..., embed=True),
    current_user: UserInDB = Depends(get_current_user),
):
    """Add garment URLs to the project."""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    result = projects_collection.update_one(
        {"_id": ObjectId(project_id), "user_id": current_user.id},
        {
            "$addToSet": {"garment_urls": {"$each": garment_urls}},
            "$set": {"updated_at": datetime.utcnow()}
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Return updated project
    return await get_project(project_id, current_user)

@router.post("/{project_id}/references", response_model=ProjectModel, response_model_by_alias=False)
async def set_references(
    project_id: str,
    reference_ids: List[str] = Body(..., embed=True),
    current_user: UserInDB = Depends(get_current_user),
):
    """Set reference photos for the project."""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    result = projects_collection.update_one(
        {"_id": ObjectId(project_id), "user_id": current_user.id},
        {
            "$set": {
                "reference_photo_ids": reference_ids,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
        
    return await get_project(project_id, current_user)

@router.post("/{project_id}/generate", response_model=List[str])
async def generate_project_tasks(
    project_id: str,
    current_user: UserInDB = Depends(get_current_user),
):
    """Trigger generation tasks for the project."""
    # 1. Get Project
    project = await get_project(project_id, current_user)
    
    if not project.garment_urls:
         raise HTTPException(status_code=400, detail="No garments in project")
    
    if not project.reference_photo_ids:
         raise HTTPException(status_code=400, detail="No reference photos selected")

    # 2. Create Tasks (Combinatorial: Garments x References)
    # Ideally should fetch reference URLs here, but for now assuming we handle that in the task worker or pass IDs
    # Let's pass reference_id as reference_image_url for now (simplified) or fetch them.
    # Better: fetch references to get URLs.
    from app.utils.database import references_collection
    
    ref_docs = list(references_collection.find({"_id": {"$in": [ObjectId(rid) for rid in project.reference_photo_ids]}}))
    ref_map = {str(doc["_id"]): doc["url"] for doc in ref_docs}
    
    created_task_ids = []
    
    for garment_url in project.garment_urls:
        for ref_id in project.reference_photo_ids:
            if ref_id not in ref_map:
                continue
                
            ref_url = ref_map[ref_id]
            
            task = GenerationTaskModel(
                user_id=str(current_user.id),
                project_id=str(project.id),
                garment_url=garment_url,
                reference_image_url=ref_url,
                workflow_type="replace_garment" if project.selected_path == "history" else "generate_new",
                status=TaskStatus.PENDING
            )
            
            task_data = task.model_dump(by_alias=True, exclude={"id"})
            # Ensure user_id and project_id are ObjectIds in MongoDB
            task_data["user_id"] = ObjectId(str(task.user_id))
            if task.project_id:
                task_data["project_id"] = ObjectId(str(task.project_id))
            
            res = generation_tasks_collection.insert_one(task_data)
            task_id = str(res.inserted_id)
            created_task_ids.append(task_id)
            
            # Trigger Celery
            generate_image_task.delay(task_id)

    # 3. Update Project with Task IDs
    projects_collection.update_one(
        {"_id": ObjectId(project_id)},
        {
            "$set": {
                "generated_task_ids": created_task_ids,
                "status": ProjectStatus.PROCESSING,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return created_task_ids

@router.get("/{project_id}/tasks", response_model=List[GenerationTaskModel], response_model_by_alias=False)
@router.get("/{project_id}/tasks/", response_model=List[GenerationTaskModel], response_model_by_alias=False, include_in_schema=False)
async def get_project_tasks(
    project_id: str,
    current_user: UserInDB = Depends(get_current_user),
):
    """Get all generation tasks for a specific project."""
    if not ObjectId.is_valid(project_id):
        raise HTTPException(status_code=400, detail="Invalid project ID")
        
    cursor = generation_tasks_collection.find({
        "project_id": ObjectId(project_id),
        "user_id": current_user.id
    }).sort("created_at", -1)
    
    tasks = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        tasks.append(GenerationTaskModel(**doc))
    return tasks
