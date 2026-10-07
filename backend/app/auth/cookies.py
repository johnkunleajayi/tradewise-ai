from fastapi import Request, Response

from app.auth.config import get_google_oauth_settings


def cookie_name(kind: str) -> str:
    prefix = "__Host-" if secure_cookies() else ""
    return f"{prefix}tradewise_{kind}"


def secure_cookies() -> bool:
    # Configuration permits plain HTTP only on loopback hosts.
    return get_google_oauth_settings().redirect_uri.scheme == "https"


def read_cookie(request: Request, kind: str) -> str | None:
    return request.cookies.get(cookie_name(kind))


def set_cookie(response: Response, kind: str, token: str, ttl: int) -> None:
    response.set_cookie(
        cookie_name(kind),
        token,
        max_age=ttl,
        path="/",
        secure=secure_cookies(),
        httponly=True,
        samesite="lax",
    )


def clear_cookie(response: Response, kind: str) -> None:
    response.delete_cookie(
        cookie_name(kind), path="/", secure=secure_cookies(), httponly=True, samesite="lax"
    )
