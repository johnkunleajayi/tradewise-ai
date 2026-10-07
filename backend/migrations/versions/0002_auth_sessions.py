"""Add server-side OAuth attempts and application sessions."""

import sqlalchemy as sa
from alembic import op

revision = "0002_auth_sessions"
down_revision = "0001_create_users"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "oauth_attempts",
        sa.Column("token_hash", sa.String(64), primary_key=True),
        sa.Column("state_data", sa.JSON(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_oauth_attempts_expires_at", "oauth_attempts", ["expires_at"])
    op.create_table(
        "auth_sessions",
        sa.Column("token_hash", sa.String(64), primary_key=True),
        sa.Column(
            "user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
        ),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_auth_sessions_user_id", "auth_sessions", ["user_id"])
    op.create_index("ix_auth_sessions_expires_at", "auth_sessions", ["expires_at"])


def downgrade() -> None:
    op.drop_table("auth_sessions")
    op.drop_table("oauth_attempts")
