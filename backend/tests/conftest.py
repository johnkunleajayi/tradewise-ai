from collections.abc import Generator
from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_session
from app.main import create_app


@pytest.fixture
def mock_session() -> Mock:
    return Mock(spec=Session)


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch, mock_session: Mock) -> Generator[TestClient]:
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://test:test@127.0.0.1/unit_test")
    monkeypatch.setenv("CORS_ORIGINS", '["http://localhost:5173","http://127.0.0.1:5173"]')
    get_settings.cache_clear()
    app = create_app()
    app.dependency_overrides[get_session] = lambda: mock_session
    with TestClient(app) as test_client:
        yield test_client
    get_settings.cache_clear()
