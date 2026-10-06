import pytest
from pydantic import ValidationError

from app.core.config import Settings


def test_configuration_comes_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://user:pass@127.0.0.1/example")
    monkeypatch.setenv("CORS_ORIGINS", '["http://localhost:5174"]')
    settings = Settings(_env_file=None)
    assert settings.database_url.path == "/example"
    assert settings.cors_origins == ["http://localhost:5174"]


def test_database_url_is_required(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("DATABASE_URL", raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


@pytest.mark.parametrize("url", ["sqlite:///test.db", "postgresql://user:pass@localhost/db"])
def test_wrong_database_driver_is_rejected(url: str) -> None:
    with pytest.raises(ValidationError):
        Settings(database_url=url, _env_file=None)
