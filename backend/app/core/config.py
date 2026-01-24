from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Tutor 2.0"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_URL: Optional[str] = None

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Ollama
    OLLAMA_MODEL: str = "phi3"
    OLLAMA_HOST: str = "http://localhost:11434"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
