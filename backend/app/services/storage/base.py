from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, BinaryIO
from pathlib import Path

class StorageService(ABC):
    """Abstract base class for storage services."""
    
    @abstractmethod
    async def upload_file(
        self,
        file_obj: BinaryIO,
        file_name: str,
        content_type: Optional[str] = None,
        **kwargs
    ) -> str:
        """
        Upload a file to storage.
        
        Args:
            file_obj: The file object to upload.
            file_name: The name to use for the file in storage.
            content_type: The MIME type of the file.
            **kwargs: Additional parameters for the storage service.
        
        Returns:
            The URL of the uploaded file.
        """
        pass
    
    @abstractmethod
    async def download_file(
        self,
        file_url: str,
        destination_path: Path,
        **kwargs
    ) -> None:
        """
        Download a file from storage.
        
        Args:
            file_url: The URL of the file to download.
            destination_path: The path to save the downloaded file.
            **kwargs: Additional parameters for the storage service.
        """
        pass
    
    @abstractmethod
    async def delete_file(
        self,
        file_url: str,
        **kwargs
    ) -> bool:
        """
        Delete a file from storage.
        
        Args:
            file_url: The URL of the file to delete.
            **kwargs: Additional parameters for the storage service.
        
        Returns:
            True if the file was deleted, False otherwise.
        """
        pass
    
    @abstractmethod
    def get_file_url(
        self,
        file_name: str,
        **kwargs
    ) -> str:
        """
        Get the URL for a file in storage.
        
        Args:
            file_name: The name of the file in storage.
            **kwargs: Additional parameters for the storage service.
        
        Returns:
            The URL of the file.
        """
        pass
    
    @abstractmethod
    def get_service_name(self) -> str:
        """
        Get the name of the storage service.
        
        Returns:
            The name of the storage service.
        """
        pass