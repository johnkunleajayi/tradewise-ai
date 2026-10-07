"""Server-side OAuth attempts and revocable application sessions."""

from datetime import datetime
from typing import Any
from uuid import UUID

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class OAuthAttempt(Base):
    __tablename__ = "oauth_attempts"

    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    state_data: Mapped[dict[str, Any]] = mapped_column(JSON)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
