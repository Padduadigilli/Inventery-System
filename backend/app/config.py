import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql://user:password@db:5432/inventory_db"
    )
    api_title: str = "Inventory Management System API"
    api_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "True").lower() == "true"

    class Config:
        env_file = ".env"


settings = Settings()
