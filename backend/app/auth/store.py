from datetime import UTC, datetime, timedelta
from hashlib import sha256
from secrets import token_urlsafe
from typing import Any
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.auth.models import AuthSession, OAuthAttempt
from app.users.model import User


def token_hash(token: str) -> str:
    return sha256(token.encode()).hexdigest()


def valid_token(token: str | None) -> bool:
    return bool(token and len(token) == 43 and all(c.isalnum() or c in "-_" for c in token))


def save_attempt(db: Session, data: dict[str, Any], ttl: int, old_token: str | None) -> str:
    now = datetime.now(UTC)
    db.execute(delete(OAuthAttempt).where(OAuthAttempt.expires_at <= now))
    if valid_token(old_token):
        db.execute(delete(OAuthAttempt).where(OAuthAttempt.token_hash == token_hash(old_token)))
    token = token_urlsafe(32)
    db.add(
        OAuthAttempt(
            token_hash=token_hash(token), state_data=data, expires_at=now + timedelta(seconds=ttl)
        )
    )
    db.commit()
    return token


def consume_attempt(db: Session, token: str | None) -> dict[str, Any] | None:
    if not valid_token(token):
        return None
    # DELETE RETURNING makes consumption atomic, including concurrent callback replays.
    data = db.scalar(
        delete(OAuthAttempt)
        .where(
            OAuthAttempt.token_hash == token_hash(token),
            OAuthAttempt.expires_at > datetime.now(UTC),
        )
        .returning(OAuthAttempt.state_data)
    )
    db.commit()
    return data


def revoke_session(db: Session, token: str | None) -> None:
    if valid_token(token):
        db.execute(delete(AuthSession).where(AuthSession.token_hash == token_hash(token)))


def create_session(db: Session, user_id: UUID, ttl: int, old_token: str | None) -> str:
    revoke_session(db, old_token)
    now = datetime.now(UTC)
    db.execute(delete(AuthSession).where(AuthSession.expires_at <= now))
    token = token_urlsafe(32)
    db.add(
        AuthSession(
            token_hash=token_hash(token), user_id=user_id, expires_at=now + timedelta(seconds=ttl)
        )
    )
    return token


def session_user(db: Session, token: str | None) -> User | None:
    if not valid_token(token):
        return None
    return db.scalar(
        select(User)
        .join(AuthSession, AuthSession.user_id == User.id)
        .where(
            AuthSession.token_hash == token_hash(token),
            AuthSession.expires_at > datetime.now(UTC),
        )
    )
