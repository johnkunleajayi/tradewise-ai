import os
from collections.abc import Generator
from datetime import UTC, datetime
from uuid import UUID, uuid4

import pytest
from dotenv import dotenv_values
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import BACKEND_ROOT
from app.users.model import User

pytestmark = pytest.mark.integration


@pytest.fixture
def db() -> Generator[Session]:
    url = os.environ.get("TEST_DATABASE_URL") or dotenv_values(BACKEND_ROOT / ".env").get(
        "TEST_DATABASE_URL"
    )
    if not url:
        pytest.skip("Set TEST_DATABASE_URL to a migrated disposable PostgreSQL database")
    parsed = make_url(url)
    if parsed.drivername != "postgresql+psycopg" or not (parsed.database or "").endswith("_test"):
        pytest.fail("TEST_DATABASE_URL must target a PostgreSQL database ending in _test")
    engine = create_engine(url)
    with engine.connect() as connection:
        transaction = connection.begin()
        with Session(bind=connection, join_transaction_mode="create_savepoint") as session:
            yield session
        transaction.rollback()
    engine.dispose()


def test_user_defaults_and_update(db: Session) -> None:
    user = User(email=f" Trader-{uuid4()}@Example.COM ", name="Demo Trader")
    db.add(user)
    db.flush()
    assert isinstance(user.id, UUID)
    assert user.google_id is None
    assert user.avatar_url is None
    assert user.email == user.email.strip().lower()
    assert user.created_at.tzinfo is not None
    assert user.updated_at.tzinfo is not None
    original_created_at = user.created_at
    user.updated_at = datetime(2000, 1, 1, tzinfo=UTC)
    db.flush()
    user.name = "Updated Trader"
    db.flush()
    db.refresh(user)
    assert user.updated_at.year > 2000
    assert user.created_at == original_created_at


@pytest.mark.parametrize("field", ["email", "google_id"])
def test_identity_uniqueness(db: Session, field: str) -> None:
    suffix = str(uuid4())
    first = User(email=f"first-{suffix}@example.com", google_id=suffix, name="First")
    db.add(first)
    db.flush()
    second = User(email=f"second-{suffix}@example.com", google_id=f"other-{suffix}", name="Second")
    setattr(second, field, getattr(first, field))
    with pytest.raises(IntegrityError), db.begin_nested():
        db.add(second)
        db.flush()


def test_database_rejects_unnormalized_email(db: Session) -> None:
    with pytest.raises(IntegrityError), db.begin_nested():
        db.execute(
            text("INSERT INTO users (email, name) VALUES (:email, :name)"),
            {"email": "UPPER@example.com", "name": "Invalid"},
        )


def test_database_generates_defaults_without_orm(db: Session) -> None:
    row = db.execute(
        text(
            "INSERT INTO users (email, name) VALUES (:email, :name) "
            "RETURNING id, created_at, updated_at"
        ),
        {"email": f"raw-{uuid4()}@example.com", "name": "Raw insert"},
    ).one()
    assert isinstance(row.id, UUID)
    assert row.created_at.tzinfo is not None
    assert row.updated_at == row.created_at
