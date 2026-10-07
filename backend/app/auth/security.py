import logging
from urllib.parse import urlsplit

from fastapi import HTTPException, Request

from app.auth.config import get_google_oauth_settings
from app.core.config import get_settings


def require_trusted_origin(request: Request) -> None:
    callback = urlsplit(str(get_google_oauth_settings().redirect_uri))
    allowed = {f"{callback.scheme}://{callback.netloc}", *get_settings().cors_origins}
    if request.headers.get("origin") not in allowed:
        raise HTTPException(403, "A trusted Origin header is required")


class AuthAccessLogFilter(logging.Filter):
    """Keep authorization codes and state out of Uvicorn access logs."""

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.args, tuple) and len(record.args) == 5:
            args = list(record.args)
            if isinstance(args[2], str) and args[2].startswith("/api/auth/"):
                args[2] = args[2].split("?", 1)[0]
                record.args = tuple(args)
        return True


def configure_auth_logging() -> None:
    logger = logging.getLogger("uvicorn.access")
    if not any(isinstance(item, AuthAccessLogFilter) for item in logger.filters):
        logger.addFilter(AuthAccessLogFilter())
    # OAuth clients can emit token responses in debug logs.
    for name in ("authlib", "httpx", "httpcore"):
        logging.getLogger(name).setLevel(logging.WARNING)
