"""Allowlisted frontend navigation for browser OAuth flows."""

from urllib.parse import urlsplit

from fastapi import HTTPException

from app.core.config import get_settings


def frontend_return_url(value: str | None) -> str | None:
    if value is None:
        return None
    url = urlsplit(value)
    allowed = {origin.rstrip("/") for origin in get_settings().cors_origins}
    if (
        value not in allowed
        or url.scheme not in {"http", "https"}
        or not url.netloc
        or url.username
        or url.password
        or url.path
        or url.query
        or url.fragment
    ):
        raise HTTPException(400, "Unsupported frontend origin")
    return value
