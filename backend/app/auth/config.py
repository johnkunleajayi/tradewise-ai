from functools import lru_cache

from pydantic import HttpUrl, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.config import BACKEND_ROOT

GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"
GOOGLE_SCOPES = "openid email profile"


class GoogleOAuthSettings(BaseSettings):
    """Configuration for the server-side authorization-code flow."""

    model_config = SettingsConfigDict(
        env_prefix="GOOGLE_",
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        env_ignore_empty=True,
        extra="ignore",
        hide_input_in_errors=True,
    )

    client_id: str = ""
    client_secret: SecretStr = SecretStr("")
    redirect_uri: HttpUrl = HttpUrl("http://localhost:8000/api/auth/google/callback")

    @field_validator("client_id")
    @classmethod
    def trim_client_id(cls, value: str) -> str:
        return value.strip()

    @field_validator("redirect_uri")
    @classmethod
    def validate_redirect_uri(cls, value: HttpUrl) -> HttpUrl:
        if value.username or value.password or value.fragment or value.query:
            raise ValueError(
                "OAuth redirect URI must not contain credentials, a query, or a fragment"
            )
        if value.scheme != "https" and value.host not in {"localhost", "127.0.0.1", "[::1]"}:
            raise ValueError("OAuth redirect URI requires HTTPS outside localhost")
        return value

    @model_validator(mode="after")
    def validate_credentials(self) -> "GoogleOAuthSettings":
        has_secret = bool(self.client_secret.get_secret_value().strip())
        if bool(self.client_id) != has_secret:
            raise ValueError(
                "Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or leave both blank"
            )
        return self

    @property
    def is_configured(self) -> bool:
        """Whether both Google client credentials are configured."""
        return bool(self.client_id and self.client_secret.get_secret_value().strip())


@lru_cache
def get_google_oauth_settings() -> GoogleOAuthSettings:
    return GoogleOAuthSettings()
