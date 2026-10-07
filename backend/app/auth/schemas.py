from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, StringConstraints

NonEmpty = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)]


class GoogleProfile(BaseModel):
    """Only constructed from claims whose ID token Authlib has verified."""

    sub: NonEmpty
    email: Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=320)]
    email_verified: Literal[True]
    name: NonEmpty
    picture: HttpUrl | None = None


class CurrentUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    name: str
    avatar_url: str | None = Field(default=None)
