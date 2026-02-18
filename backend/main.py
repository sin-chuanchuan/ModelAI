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
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://*.vercel.app",  # Allow all Vercel previews
        "*"                       # Fallback for dynamic production domains
    ],
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
from app.routers import auth, generate, image, users, materials, references, projects

# Add debug middleware to see actual hit paths
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"[DEBUG] Request path: {request.url.path}")
    response = await call_next(request)
    print(f"[DEBUG] Response status: {response.status_code}")
    return response

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(generate.router, prefix="/generate", tags=["generate"])
app.include_router(image.router, prefix="/image", tags=["image"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(materials.router, prefix="/materials", tags=["materials"])
app.include_router(references.router, prefix="/references", tags=["references"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])

# Static files
from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)