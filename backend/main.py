from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="电商模特图片生成工具 API",
    description="用于生成电商模特图片的后端API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "电商模特图片生成工具 API",
        "version": "1.0.0"
    }

# Include routers
from app.routers import auth, generate, image
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(generate.router, prefix="/generate", tags=["generate"])
app.include_router(image.router, prefix="/image", tags=["image"])

from app.routers import users, materials
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(materials.router, prefix="/materials", tags=["materials"])

# Static files
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)