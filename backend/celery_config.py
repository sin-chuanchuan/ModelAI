from celery import Celery
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get Redis URL from environment variables
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Create Celery instance
celery = Celery(
    "tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks.generate"]
)

# Configure Celery
celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Shanghai",
    enable_utc=True,
    task_track_started=True,
    result_expires=3600,  # Results expire after 1 hour
    worker_concurrency=4,  # Number of concurrent workers
)

if __name__ == "__main__":
    celery.start()