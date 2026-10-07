"""Explicit model registry used by Alembic autogeneration."""

from app.auth.models import AuthSession, OAuthAttempt
from app.users.model import User

__all__ = ["AuthSession", "OAuthAttempt", "User"]
