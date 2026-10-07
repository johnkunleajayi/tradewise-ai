from fastapi import APIRouter

from app.auth.router import router as auth_router
from app.health.router import router as health_router

router = APIRouter(prefix="/api")
router.include_router(health_router)

router.include_router(auth_router)
