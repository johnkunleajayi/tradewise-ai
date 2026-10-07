from typing import Annotated

from authlib.integrations.base_client.errors import OAuthError
from authlib.integrations.starlette_client import StarletteOAuth2App
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from httpx import HTTPError
from joserfc.errors import JoseError
from pydantic import ValidationError
from starlette.concurrency import run_in_threadpool

from app.auth.client import get_google_client
from app.auth.config import get_google_oauth_settings
from app.auth.cookies import clear_cookie, read_cookie, set_cookie
from app.auth.route import PrivateAuthRoute
from app.auth.schemas import CurrentUser, GoogleProfile
from app.auth.security import require_trusted_origin
from app.auth.service import finish_login
from app.auth.session_config import get_session_settings
from app.auth.store import (
    consume_attempt,
    revoke_session,
    save_attempt,
    session_user,
)
from app.db.session import DatabaseSession

router = APIRouter(prefix="/auth", tags=["auth"], route_class=PrivateAuthRoute)
GoogleClient = Annotated[StarletteOAuth2App, Depends(get_google_client)]


@router.get("/google/login")
async def google_login(request: Request, db: DatabaseSession, google: GoogleClient):
    request.scope["session"] = {}
    try:
        response = await google.authorize_redirect(
            request, str(get_google_oauth_settings().redirect_uri), prompt="select_account"
        )
    except (OAuthError, HTTPError, ValueError):
        raise HTTPException(502, "Google login temporarily unavailable") from None
    ttl = get_session_settings().oauth_ttl_seconds
    token = await run_in_threadpool(
        save_attempt, db, request.session, ttl, read_cookie(request, "oauth")
    )
    set_cookie(response, "oauth", token, ttl)
    return response


@router.get("/google/callback")
async def google_callback(request: Request, db: DatabaseSession, google: GoogleClient):
    data = await run_in_threadpool(consume_attempt, db, read_cookie(request, "oauth"))
    if not data:
        raise HTTPException(400, "Login expired or invalid; start Google login again")
    request.scope["session"] = data
    try:
        token = await google.authorize_access_token(request)
        # Authlib verifies signature, issuer, audience, expiry and the saved nonce.
        if not token.get("id_token"):
            raise ValueError("Missing ID token")
        profile = GoogleProfile.model_validate(token.get("userinfo"))
    except (OAuthError, JoseError, ValidationError, ValueError):
        raise HTTPException(400, "Google authentication failed; start login again") from None
    except HTTPError:
        raise HTTPException(502, "Google login temporarily unavailable") from None
    session_token = await run_in_threadpool(
        finish_login, db, profile, read_cookie(request, "session")
    )
    response = RedirectResponse("/api/auth/me", status_code=303)
    clear_cookie(response, "oauth")
    set_cookie(response, "session", session_token, get_session_settings().session_ttl_seconds)
    return response


@router.get("/me", response_model=CurrentUser)
def me(request: Request, db: DatabaseSession):
    user = session_user(db, read_cookie(request, "session"))
    if user is None:
        raise HTTPException(401, "Not authenticated")
    return user


@router.post("/logout", status_code=204, dependencies=[Depends(require_trusted_origin)])
def logout(request: Request, db: DatabaseSession):
    revoke_session(db, read_cookie(request, "session"))
    consume_attempt(db, read_cookie(request, "oauth"))
    db.commit()
    response = Response(status_code=204)
    clear_cookie(response, "session")
    clear_cookie(response, "oauth")
    return response
