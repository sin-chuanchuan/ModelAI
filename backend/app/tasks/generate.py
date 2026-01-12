from typing import Dict, Any, Optional
from app.services.ai.factory import AIServiceFactory
from app.utils.database import generation_tasks_collection
from datetime import datetime

def generate_image_task(
    self,
    prompt: str,
    image_urls: Optional[Dict[str, str]] = None,
    service: str = "openai",
    size: str = "1024x1024",
    quality: str = "standard",
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Celery task for generating an image asynchronously.
    
    Args:
        self: The task instance.
        prompt: The text prompt to generate the image from.
        image_urls: Optional dictionary of reference images.
        service: The AI service to use.
        size: The size of the generated image.
        quality: The quality of the generated image.
        user_id: The ID of the user who requested the generation.
    
    Returns:
        A dictionary containing the generated image URL and metadata.
    """
    # Update task state to STARTED
    self.update_state(state="STARTED", meta={"progress": 0, "status": "Initializing generation..."})
    
    # Create task record in database
    task_id = self.request.id
    task_record = {
        "_id": task_id,
        "user_id": user_id,
        "prompt": prompt,
        "image_urls": image_urls,
        "service": service,
        "size": size,
        "quality": quality,
        "status": "STARTED",
        "progress": 0,
        "result": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    generation_tasks_collection.insert_one(task_record)
    
    try:
        # Update task state to PROCESSING
        self.update_state(state="PROCESSING", meta={"progress": 30, "status": "Generating image..."})
        
        # Get the AI service instance
        ai_service = AIServiceFactory.get_service(service)
        
        # Generate the image - Using direct sync call for testing
        # Note: In production, we should use asyncio.run() or similar to handle async calls
        import asyncio
        result = asyncio.run(ai_service.generate_image(
            prompt=prompt,
            image_urls=image_urls,
            size=size,
            quality=quality
        ))
        
        # Update task state to COMPLETED
        self.update_state(state="COMPLETED", meta={"progress": 100, "status": "Image generated successfully!"})
        
        # Update task record in database
        generation_tasks_collection.update_one(
            {"_id": task_id},
            {
                "$set": {
                    "status": "COMPLETED",
                    "progress": 100,
                    "result": result,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return result
    except Exception as e:
        # Update task state to FAILED
        self.update_state(state="FAILED", meta={"progress": 0, "status": f"Failed to generate image: {str(e)}"})
        
        # Update task record in database
        generation_tasks_collection.update_one(
            {"_id": task_id},
            {
                "$set": {
                    "status": "FAILED",
                    "progress": 0,
                    "error": str(e),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Re-raise the exception to mark the task as failed
        raise