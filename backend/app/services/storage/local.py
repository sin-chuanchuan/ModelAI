import os
import uuid
from typing import Dict, Any, Optional, BinaryIO
from pathlib import Path
from app.services.storage.base import StorageService

class LocalStorageService(StorageService):
    """Local file storage service implementation."""
    
    def __init__(self, base_path: str = "./uploads"):
        """
        Initialize the local storage service.
        
        Args:
            base_path: The base path for storing files.
        """
        self.base_path = Path(base_path)
        self.base_path.mkdir(exist_ok=True, parents=True)
        
        # Create subdirectories for different file types
        self.upload_dir = self.base_path / "uploads"
        self.generated_dir = self.base_path / "generated"
        
        self.upload_dir.mkdir(exist_ok=True)
        self.generated_dir.mkdir(exist_ok=True)
    
    async def upload_file(
        self,
        file_obj: BinaryIO,
        file_name: str,
        content_type: Optional[str] = None,
        file_type: str = "upload",
        **kwargs
    ) -> str:
        """
        Upload a file to local storage.
        
        Args:
            file_obj: The file object to upload.
            file_name: The name to use for the file in storage.
            content_type: The MIME type of the file.
            file_type: The type of file (upload or generated).
            **kwargs: Additional parameters.
        
        Returns:
            The URL of the uploaded file.
        """
        # Determine the upload directory based on file type
        if file_type == "generated":
            upload_dir = self.generated_dir
        else:
            upload_dir = self.upload_dir
        
        # Generate a unique file name to avoid collisions
        file_ext = Path(file_name).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = upload_dir / unique_filename
        
        # Write the file to disk asynchronously
        import aiofiles
        import asyncio
        async with aiofiles.open(file_path, "wb") as f:
            content = file_obj.read()
            # 兼容 UploadFile 的 read() 可能是协程的情况
            if asyncio.iscoroutine(content):
                content = await content
            await f.write(content)
        
        # Return the file URL (local static path)
        return f"/uploads/{file_type}s/{unique_filename}"
    
    async def download_file(
        self,
        file_url: str,
        destination_path: Path,
        **kwargs
    ) -> None:
        """
        Download a file from local storage.
        
        Args:
            file_url: The URL of the file to download.
            destination_path: The path to save the downloaded file.
            **kwargs: Additional parameters.
        """
        # Convert URL to local path
        if file_url.startswith("file://"):
            file_path = Path(file_url[7:])
        else:
            # Assume the URL is already a local path
            file_path = Path(file_url)
        
        # Read the file and write to destination
        with open(file_path, "rb") as f:
            with open(destination_path, "wb") as dest_f:
                dest_f.write(f.read())
    
    async def delete_file(
        self,
        file_url: str,
        **kwargs
    ) -> bool:
        """
        Delete a file from local storage.
        
        Args:
            file_url: The URL of the file to delete.
            **kwargs: Additional parameters.
        
        Returns:
            True if the file was deleted, False otherwise.
        """
        try:
            # Convert URL to local path
            if file_url.startswith("file://"):
                file_path = Path(file_url[7:])
            else:
                file_path = Path(file_url)
            
            # Delete the file if it exists
            if file_path.exists():
                file_path.unlink()
                return True
            return False
        except Exception as e:
            print(f"Error deleting file: {e}")
            return False
    
    def get_file_url(
        self,
        file_name: str,
        file_type: str = "upload",
        **kwargs
    ) -> str:
        """
        Get the URL for a file in local storage.
        
        Args:
            file_name: The name of the file in storage.
            file_type: The type of file (upload or generated).
            **kwargs: Additional parameters.
        
        Returns:
            The URL of the file.
        """
        # Determine the directory based on file type
        if file_type == "generated":
            return f"http://localhost:8000/uploads/generated/{file_name}"
        else:
            return f"http://localhost:8000/uploads/uploads/{file_name}"
    
    def get_service_name(self) -> str:
        """
        Get the name of the storage service.
        
        Returns:
            The name of the storage service.
        """
        return "local"