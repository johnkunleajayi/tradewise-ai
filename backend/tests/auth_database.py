"""Run the same OAuth tests against isolated SQLite or migrated PostgreSQL."""

import os
from contextlib import contextmanager

import pytest
from dotenv import dotenv_values
from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.core.config import BACKEND_ROOT
from app.db.base import Base


@contextmanager
def auth_database(postgres: bool):
    if postgres:
        url = os.environ.get("TEST_DATABASE_URL") or dotenv_values(BACKEND_ROOT / ".env").get(
            "TEST_DATABASE_URL"
        )
        if not url:
            pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests")
        parsed = make_url(url)
        if parsed.drivername != "postgresql+psycopg" or not (parsed.database or "").endswith(
            "_test"
        ):
            pytest.fail("OAuth integration tests require a PostgreSQL database ending in _test")
        engine = create_engine(url)
    else:
        engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        Base.metadata.create_all(engine)
    try:
        with engine.connect() as connection:
            transaction = connection.begin()
            try:
                with Session(
                    bind=connection,
                    expire_on_commit=False,
                    join_transaction_mode="create_savepoint",
                ) as db:
                    yield db
            finally:
                transaction.rollback()
    finally:
        engine.dispose()
