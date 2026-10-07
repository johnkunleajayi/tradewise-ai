from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.config import BACKEND_ROOT


class SessionSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="AUTH_", env_file=BACKEND_ROOT / ".env", extra="ignore"
    )

    session_ttl_seconds: int = Field(default=86400, ge=300, le=604800)
    oauth_ttl_seconds: int = Field(default=600, ge=60, le=900)


@lru_cache
def get_session_settings() -> SessionSettings:
    return SessionSettings()
