import pytest
from pydantic import ValidationError

from app.auth.config import GOOGLE_DISCOVERY_URL, GOOGLE_SCOPES, GoogleOAuthSettings


@pytest.fixture(autouse=True)
def clear_google_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    for key in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI"):
        monkeypatch.delenv(key, raising=False)


def test_unconfigured_defaults_are_safe() -> None:
    settings = GoogleOAuthSettings(_env_file=None)
    assert not settings.is_configured
    assert str(settings.redirect_uri) == "http://localhost:8000/api/auth/google/callback"
    assert GOOGLE_SCOPES == "openid email profile"
    assert GOOGLE_DISCOVERY_URL == "https://accounts.google.com/.well-known/openid-configuration"


def test_reads_environment_and_masks_secret(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("GOOGLE_CLIENT_ID", " example.apps.googleusercontent.com ")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "test-only-not-a-real-secret")
    monkeypatch.setenv("GOOGLE_REDIRECT_URI", "http://127.0.0.1:8001/api/auth/google/callback")
    settings = GoogleOAuthSettings(_env_file=None)
    assert settings.is_configured
    assert settings.client_id == "example.apps.googleusercontent.com"
    assert settings.redirect_uri.port == 8001
    assert settings.client_secret.get_secret_value() == "test-only-not-a-real-secret"
    assert "test-only-not-a-real-secret" not in repr(settings)
    assert "test-only-not-a-real-secret" not in settings.model_dump_json()


def test_blank_template_remains_unconfigured(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("GOOGLE_CLIENT_ID", "")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "")
    assert not GoogleOAuthSettings(_env_file=None).is_configured


@pytest.mark.parametrize(
    "credentials",
    [
        {"client_id": "example"},
        {"client_secret": "test-only-secret"},
        {"client_id": "example", "client_secret": "   "},
    ],
)
def test_partial_credentials_are_rejected(credentials: dict[str, str]) -> None:
    with pytest.raises(ValidationError) as error:
        GoogleOAuthSettings(**credentials, _env_file=None)
    assert "test-only-secret" not in str(error.value)


@pytest.mark.parametrize(
    "uri",
    [
        "not-a-url",
        "http://example.com/callback",
        "https://example.com/callback#fragment",
        "https://example.com/callback?next=elsewhere",
        "https://user:password@example.com/callback",
    ],
)
def test_invalid_redirects_are_rejected(uri: str) -> None:
    with pytest.raises(ValidationError):
        GoogleOAuthSettings(redirect_uri=uri, _env_file=None)


def test_https_redirect_is_allowed() -> None:
    settings = GoogleOAuthSettings(redirect_uri="https://example.com/callback", _env_file=None)
    assert settings.redirect_uri.scheme == "https"
