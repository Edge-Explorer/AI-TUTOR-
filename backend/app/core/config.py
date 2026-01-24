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
    OLLAMA_HOST: str = "http://127.0.0.1:11434"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Ensure OLLAMA_HOST has protocol
        if self.OLLAMA_HOST and not self.OLLAMA_HOST.startswith(('http://', 'https://')):
            self.OLLAMA_HOST = f"http://{self.OLLAMA_HOST}"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
