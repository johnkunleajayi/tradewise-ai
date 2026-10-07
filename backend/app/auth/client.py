from functools import lru_cache

from authlib.integrations.starlette_client import OAuth, StarletteOAuth2App
from fastapi import HTTPException

from app.auth.config import GOOGLE_DISCOVERY_URL, GOOGLE_SCOPES, get_google_oauth_settings


@lru_cache
def get_google_client() -> StarletteOAuth2App:
    settings = get_google_oauth_settings()
    if not settings.is_configured:
        raise HTTPException(503, "Google login is not configured")
    oauth = OAuth()
    return oauth.register(
        name="google",
        client_id=settings.client_id,
        client_secret=settings.client_secret.get_secret_value(),
        server_metadata_url=GOOGLE_DISCOVERY_URL,
        client_kwargs={"scope": GOOGLE_SCOPES, "code_challenge_method": "S256", "timeout": 10},
    )
