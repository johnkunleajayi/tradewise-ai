from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute
from sqlalchemy.exc import SQLAlchemyError


class PrivateAuthRoute(APIRoute):
    def get_route_handler(self):
        handler = super().get_route_handler()

        async def private_handler(request: Request):
            try:
                response = await handler(request)
            except HTTPException as error:
                response = JSONResponse({"detail": error.detail}, status_code=error.status_code)
            except SQLAlchemyError:
                # Database exceptions may contain profile data or session parameters.
                response = JSONResponse(
                    {"detail": "Authentication temporarily unavailable"}, status_code=503
                )
            response.headers["Cache-Control"] = "no-store"
            response.headers["Referrer-Policy"] = "no-referrer"
            return response

        return private_handler
