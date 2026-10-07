import logging

from fastapi import Response

from app.auth import cookies
from app.auth.config import GoogleOAuthSettings
from app.auth.security import AuthAccessLogFilter


def test_https_session_cookie_is_host_only_and_secure(monkeypatch):
    settings = GoogleOAuthSettings(_env_file=None, redirect_uri="https://example.com/callback")
    monkeypatch.setattr(cookies, "get_google_oauth_settings", lambda: settings)
    response = Response()
    cookies.set_cookie(response, "session", "test-token", 300)
    header = response.headers["set-cookie"]
    assert header.startswith("__Host-tradewise_session=")
    for flag in ("HttpOnly", "Secure", "SameSite=lax", "Path=/", "Max-Age=300"):
        assert flag in header
    assert "Domain=" not in header
    cookies.clear_cookie(response, "session")
    assert "Max-Age=0" in response.headers.getlist("set-cookie")[-1]


def test_access_log_omits_callback_code_and_state():
    record = logging.LogRecord(
        "uvicorn.access",
        logging.INFO,
        "",
        0,
        '%s - "%s %s HTTP/%s" %s',
        ("local", "GET", "/api/auth/google/callback?code=private&state=private", "1.1", 303),
        None,
    )
    assert AuthAccessLogFilter().filter(record)
    assert "private" not in record.getMessage()
    assert "/api/auth/google/callback" in record.getMessage()
