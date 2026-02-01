from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Optional

# 动态获取项目根目录
BASE_DIR = Path(__file__).resolve().parent.parent

class Config(BaseSettings):
    """项目配置类 (基于 Pydantic)"""
    
    # ========== 基础配置 ==========
    SECRET_KEY: str = "modelai-dev-secret-key-2024"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"  # development / production

    # ========== 数据库配置 ==========
    # 默认使用 SQLite，生产环境可通过环境变量覆盖为 PostgreSQL
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/sql_app.db"
    
    # Redis 配置 (可选，用于任务队列)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # ========== 文件存储配置 ==========
    UPLOAD_FOLDER: Path = BASE_DIR / "uploads"
    GENERATED_FOLDER: Path = BASE_DIR / "generated"
    STATIC_FOLDER: Path = BASE_DIR / "backend" / "static"
    
    # 存储类型: local / oss / s3
    STORAGE_TYPE: str = "local" 
    
    # OSS / S3 配置 (仅当 STORAGE_TYPE != local 时需要)
    OSS_ACCESS_KEY_ID: Optional[str] = None
    OSS_ACCESS_KEY_SECRET: Optional[str] = None
    OSS_ENDPOINT: Optional[str] = None
    OSS_BUCKET_NAME: Optional[str] = None

    # ========== AI服务配置 ==========
    AI_PROVIDER: str = "doubao"  # doubao / openai / baidu
    
    DOUBAO_API_KEY: Optional[str] = None
    BAIDU_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # ========== 业务配置 ==========
    ALLOWED_EXTENSIONS: set = {'png', 'jpg', 'jpeg', 'webp'}
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16MB
    
    PRICING: dict = {
        "trial": {"images": 10, "price": 0},      
        "basic": {"images": 100, "price": 99},    
        "pro": {"images": 500, "price": 399},     
        "business": {"images": 2000, "price": 1299} 
    }
    
    class Config:
        env_file = ".env"
        extra = "ignore" # 忽略多余的坏境变量

    def init_app(self):
        """初始化应用目录"""
        self.UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
        self.GENERATED_FOLDER.mkdir(parents=True, exist_ok=True)
        self.STATIC_FOLDER.mkdir(parents=True, exist_ok=True)
        
        print("=" * 50)
        print(f"🚀 ModelAI Config Loaded ({self.ENVIRONMENT})")
        print(f"📂 Base Dir: {BASE_DIR}")
        print(f"💾 Storage: {self.STORAGE_TYPE}")
        if self.STORAGE_TYPE == 'local':
            print(f"   Uploads: {self.UPLOAD_FOLDER}")
        print("=" * 50)

config = Config()


