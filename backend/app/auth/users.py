from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.schemas import GoogleProfile
from app.users.model import User


def sync_google_user(db: Session, profile: GoogleProfile) -> User:
    user = db.scalar(select(User).where(User.google_id == profile.sub))
    email = profile.email.lower()
    owner = db.scalar(select(User).where(User.email == email))
    # Email alone must never link or replace another identity, even if Google verified it.
    if owner is not None and (user is None or owner.id != user.id):
        raise HTTPException(409, "An account with this email already exists")
    if user is None:
        user = User(google_id=profile.sub, email=email, name=profile.name)
        db.add(user)
    user.email = email
    user.name = profile.name
    user.avatar_url = str(profile.picture) if profile.picture else None
    db.flush()
    return user
