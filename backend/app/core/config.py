from pydantic import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    # Voiceflow API
    voiceflow_api_key: str = os.getenv("VOICEFLOW_API_KEY", "demo_key")
    voiceflow_api_url: str = "https://analytics-api.voiceflow.com"
    
    # Cache settings
    redis_url: Optional[str] = os.getenv("REDIS_URL")
    supabase_url: Optional[str] = os.getenv("SUPABASE_URL")
    supabase_key: Optional[str] = os.getenv("SUPABASE_KEY")
    
    # Cache TTL in minutes
    cache_ttl_minutes: int = 5
    
    class Config:
        env_file = ".env"

settings = Settings()
