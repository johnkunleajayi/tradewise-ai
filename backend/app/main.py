from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.auth.security import configure_auth_logging
from app.core.config import get_settings
from app.db.session import get_engine, get_session_factory


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    yield
    get_engine().dispose()
    get_session_factory.cache_clear()
    get_engine.cache_clear()


def create_app() -> FastAPI:
    configure_auth_logging()
    settings = get_settings()
    app = FastAPI(title="TradeWise AI API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )
    app.include_router(router)
    return app
