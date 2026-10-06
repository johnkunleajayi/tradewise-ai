from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.exc import OperationalError


def test_health_checks_database(client: TestClient, mock_session: Mock) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "connected"}
    assert str(mock_session.execute.call_args.args[0]) == "SELECT 1"


def test_health_hides_database_failure(client: TestClient, mock_session: Mock) -> None:
    mock_session.execute.side_effect = OperationalError("SELECT 1", {}, Exception("secret"))
    response = client.get("/api/health")
    assert response.status_code == 503
    assert response.json() == {"status": "unavailable", "database": "unavailable"}
    assert "secret" not in response.text


@pytest.mark.parametrize("origin", ["http://localhost:5173", "http://127.0.0.1:5173"])
def test_vite_cors(client: TestClient, origin: str) -> None:
    response = client.options(
        "/api/health",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_cors_rejects_unknown_origin(client: TestClient) -> None:
    response = client.options(
        "/api/health",
        headers={
            "Origin": "https://untrusted.example",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
