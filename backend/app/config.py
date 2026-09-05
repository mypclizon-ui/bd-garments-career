from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # PostgreSQL via Docker is the default; falls back to SQLite locally.
    database_url: str = "sqlite:///./bdgc_gov.db"
    port: int = 8100

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()