from datetime import UTC, datetime, timedelta
from urllib.parse import parse_qs, urlsplit

import pytest
from auth_database import auth_database
from fastapi.testclient import TestClient
from oauth_provider import GoogleProvider
from sqlalchemy import select

from app.auth.client import get_google_client
from app.auth.config import get_google_oauth_settings
from app.auth.models import AuthSession, OAuthAttempt
from app.auth.store import token_hash
from app.core.config import get_settings
from app.db.session import get_session
from app.main import create_app
from app.users.model import User


@pytest.fixture(params=[False, pytest.param(True, marks=pytest.mark.integration)])
def flow(monkeypatch, request):
    monkeypatch.setenv("GOOGLE_CLIENT_ID", "test-client")
    monkeypatch.setenv("GOOGLE_CLIENT_SECRET", "test-only-secret")
    monkeypatch.setenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")
    monkeypatch.setenv("DATABASE_URL", "postgresql+psycopg://test:test@localhost/test")
    monkeypatch.setenv("CORS_ORIGINS", '["http://localhost:5173"]')
    get_google_oauth_settings.cache_clear()
    get_settings.cache_clear()
    provider = GoogleProvider()
    with auth_database(request.param) as db:
        app = create_app()
        app.dependency_overrides[get_session] = lambda: db
        app.dependency_overrides[get_google_client] = lambda: provider.client
        with TestClient(app, base_url="http://localhost:8000") as client:
            yield client, db, provider
    get_google_oauth_settings.cache_clear()
    get_settings.cache_clear()


def start(flow):
    client, _, provider = flow
    response = client.get("/api/auth/google/login", follow_redirects=False)
    assert response.status_code == 302
    query = parse_qs(urlsplit(response.headers["location"]).query)
    provider.nonce = query["nonce"][0]
    provider.challenge = query["code_challenge"][0]
    assert query["code_challenge_method"] == ["S256"]
    assert set(query["scope"][0].split()) == {"openid", "email", "profile"}
    return query["state"][0], response


def complete(flow):
    state, _ = start(flow)
    return flow[0].get(
        "/api/auth/google/callback",
        params={"state": state, "code": "test-code"},
        follow_redirects=False,
    )


def test_login_profile_session_and_logout(flow):
    client, db, _ = flow
    assert client.get("/api/auth/me").status_code == 401
    response = complete(flow)
    assert response.status_code == 303
    assert response.headers["location"] == "/api/auth/me"
    assert "HttpOnly" in response.headers["set-cookie"]
    assert "SameSite=lax" in response.headers["set-cookie"]
    assert "no-store" == response.headers["cache-control"]
    assert "no-referrer" == response.headers["referrer-policy"]
    session_token = client.cookies.get("tradewise_session")
    saved = db.scalar(select(AuthSession))
    assert saved.token_hash == token_hash(session_token)
    assert saved.token_hash != session_token
    assert db.scalar(select(OAuthAttempt)) is None
    profile = client.get("/api/auth/me")
    assert profile.status_code == 200
    assert profile.json()["email"] == "trader@example.com"
    assert set(profile.json()) == {"id", "name", "email", "avatar_url"}
    assert "private-access-token" not in profile.text
    assert (
        client.post("/api/auth/logout", headers={"Origin": "http://localhost:8000"}).status_code
        == 204
    )
    assert client.get("/api/auth/me").status_code == 401
    client.cookies.set("tradewise_session", session_token)
    assert client.get("/api/auth/me").status_code == 401


def test_returning_user_updates_profile_and_rotates_session(flow):
    client, db, provider = flow
    assert complete(flow).status_code == 303
    old = client.cookies.get("tradewise_session")
    user_id = client.get("/api/auth/me").json()["id"]
    provider.claims.update(name="New name", email="new@example.com", picture=None)
    assert complete(flow).status_code == 303
    assert client.cookies.get("tradewise_session") != old
    assert db.get(AuthSession, token_hash(old)) is None
    profile = client.get("/api/auth/me").json()
    assert profile["id"] == user_id
    assert profile["name"] == "New name"
    assert profile["email"] == "new@example.com"
    assert profile["avatar_url"] is None
    assert len(db.scalars(select(User)).all()) == 1


@pytest.mark.parametrize(
    "mutation",
    [
        {"nonce": "wrong"},
        {"aud": "other-client"},
        {"iss": "https://evil.example"},
        {"exp": 1},
        {"email_verified": False},
        {"sub": ""},
        {"email": None},
    ],
)
def test_invalid_identity_rejected(flow, mutation):
    client, db, provider = flow
    provider.claims.update(mutation)
    response = complete(flow)
    assert response.status_code == 400
    assert db.scalar(select(User)) is None
    assert client.get("/api/auth/me").status_code == 401
    assert "test-only-secret" not in response.text


@pytest.mark.parametrize("fault", ["bad_signature", "omit_id_token"])
def test_missing_or_forged_id_token_rejected(flow, fault):
    setattr(flow[2], fault, True)
    assert complete(flow).status_code == 400
    assert flow[1].scalar(select(AuthSession)) is None


def test_state_mismatch_and_callback_replay(flow):
    client, _, provider = flow
    state, _ = start(flow)
    response = client.get("/api/auth/google/callback", params={"state": "wrong", "code": "test"})
    assert response.status_code == 400
    assert provider.exchanges == 0
    assert (
        client.get("/api/auth/google/callback", params={"state": state, "code": "test"}).status_code
        == 400
    )
    assert provider.exchanges == 0


def test_successful_callback_cannot_be_replayed(flow):
    client, _, provider = flow
    state, _ = start(flow)
    attempt_token = client.cookies.get("tradewise_oauth")
    assert (
        client.get(
            "/api/auth/google/callback",
            params={"state": state, "code": "test"},
            follow_redirects=False,
        ).status_code
        == 303
    )
    client.cookies.set("tradewise_oauth", attempt_token)
    assert (
        client.get("/api/auth/google/callback", params={"state": state, "code": "test"}).status_code
        == 400
    )
    assert provider.exchanges == 1


def test_missing_browser_binding_denied(flow):
    client, _, provider = flow
    state, _ = start(flow)
    client.cookies.clear()
    assert (
        client.get("/api/auth/google/callback", params={"state": state, "code": "test"}).status_code
        == 400
    )
    assert provider.exchanges == 0


def test_denied_consent_is_safe(flow):
    client, db, _ = flow
    state, _ = start(flow)
    response = client.get(
        "/api/auth/google/callback",
        params={"state": state, "error": "access_denied", "error_description": "private-error"},
    )
    assert response.status_code == 400
    assert "private-error" not in response.text
    assert db.scalar(select(OAuthAttempt)) is None


def test_expired_attempt_denied(flow):
    client, db, provider = flow
    state, _ = start(flow)
    db.scalar(select(OAuthAttempt)).expires_at = datetime.now(UTC) - timedelta(seconds=1)
    db.commit()
    assert (
        client.get("/api/auth/google/callback", params={"state": state, "code": "test"}).status_code
        == 400
    )
    assert provider.exchanges == 0


def test_expired_and_tampered_session_denied(flow):
    client, db, _ = flow
    assert complete(flow).status_code == 303
    db.scalar(select(AuthSession)).expires_at = datetime.now(UTC) - timedelta(seconds=1)
    db.commit()
    assert client.get("/api/auth/me").status_code == 401
    client.cookies.clear()
    client.cookies.set("tradewise_session", "x" * 43)
    assert client.get("/api/auth/me").status_code == 401


@pytest.mark.parametrize("google_id", [None, "someone-else"])
def test_email_collision_does_not_link_accounts(flow, google_id):
    _, db, _ = flow
    db.add(User(email="trader@example.com", name="Existing", google_id=google_id))
    db.commit()
    assert complete(flow).status_code == 409
    user = db.scalar(select(User))
    assert user.google_id == google_id
    assert user.name == "Existing"
    assert db.scalar(select(AuthSession)) is None


@pytest.mark.parametrize("origin", [None, "null", "https://evil.example"])
def test_logout_rejects_csrf(flow, origin):
    client, _, _ = flow
    assert complete(flow).status_code == 303
    headers = {} if origin is None else {"Origin": origin}
    assert client.post("/api/auth/logout", headers=headers).status_code == 403
    assert client.get("/api/auth/me").status_code == 200
    assert client.get("/api/auth/logout").status_code == 405


def test_provider_outage_is_sanitized(flow):
    client, _, provider = flow
    provider.unavailable = True
    response = client.get("/api/auth/google/login")
    assert response.status_code == 502
    assert "private-provider-error" not in response.text


def test_credentialed_cors_is_restricted(flow):
    client, _, _ = flow
    response = client.options(
        "/api/auth/logout",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
    )
    assert response.headers["access-control-allow-credentials"] == "true"
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    response = client.options(
        "/api/auth/logout",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"},
    )
    assert response.status_code == 400


def test_frontend_login_returns_to_allowlisted_origin(flow):
    client, _, provider = flow
    response = client.get(
        "/api/auth/google/login",
        params={"return_to": "http://localhost:5173"},
        follow_redirects=False,
    )
    query = parse_qs(urlsplit(response.headers["location"]).query)
    provider.nonce = query["nonce"][0]
    provider.challenge = query["code_challenge"][0]
    response = client.get(
        "/api/auth/google/callback",
        params={"state": query["state"][0], "code": "test"},
        follow_redirects=False,
    )
    assert response.status_code == 303
    assert response.headers["location"] == "http://localhost:5173"
    assert client.get("/api/auth/me").status_code == 200


def test_frontend_consent_failure_returns_safe_error(flow):
    client, _, _ = flow
    response = client.get(
        "/api/auth/google/login",
        params={"return_to": "http://localhost:5173"},
        follow_redirects=False,
    )
    query = parse_qs(urlsplit(response.headers["location"]).query)
    response = client.get(
        "/api/auth/google/callback",
        params={
            "state": query["state"][0],
            "error": "access_denied",
            "error_description": "private-detail",
        },
        follow_redirects=False,
    )
    assert response.status_code == 303
    assert response.headers["location"] == "http://localhost:5173?auth_error=failed"
    assert "private-detail" not in response.text
    assert client.get("/api/auth/me").status_code == 401


@pytest.mark.parametrize(
    "target",
    [
        "https://evil.example",
        "http://localhost:5173.evil.example",
        "http://localhost:5173/path",
        "//localhost:5173",
    ],
)
def test_frontend_redirect_rejects_untrusted_targets(flow, target):
    client, db, _ = flow
    response = client.get(
        "/api/auth/google/login", params={"return_to": target}, follow_redirects=False
    )
    assert response.status_code == 400
    assert db.scalar(select(OAuthAttempt)) is None
