from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.schemas import GoogleProfile
from app.auth.session_config import get_session_settings
from app.auth.store import create_session
from app.auth.users import sync_google_user


def finish_login(db: Session, profile: GoogleProfile, old_token: str | None) -> str:
    try:
        user = sync_google_user(db, profile)
        token = create_session(db, user.id, get_session_settings().session_ttl_seconds, old_token)
        db.commit()
        return token
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Account changed during login; please try again") from None
