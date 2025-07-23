from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str
    
    # App Config
    app_name: str = "AI Text Summarizer"
    debug: bool = False
    
    # Database
    database_url: str = "sqlite:///./summarizer.db"
    
    # JWT
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "../../../.env")

@lru_cache()
def get_settings():
    return Settings()