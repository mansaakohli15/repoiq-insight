"""Initial database schema.

Revision ID: f42b7ba0697d
Revises:
Create Date: 2026-08-05
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "f42b7ba0697d"
down_revision: str | None = None
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)
    op.create_index("ix_users_username", "users", ["username"], unique=True)

    op.create_table(
        "repositories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("owner", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("github_url", sa.String(length=2048), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("primary_language", sa.String(length=100), nullable=True),
        sa.Column("stars", sa.Integer(), server_default="0", nullable=False),
        sa.Column("forks", sa.Integer(), server_default="0", nullable=False),
        sa.Column("default_branch", sa.String(length=255), server_default="main", nullable=False),
        sa.Column("health_score", sa.Float(), nullable=True),
        sa.Column(
            "imported_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("github_url"),
        sa.UniqueConstraint("user_id", "owner", "name", name="uq_repositories_user_owner_name"),
    )
    op.create_index("ix_repositories_user_id", "repositories", ["user_id"], unique=False)

    op.create_table(
        "analyses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("repository_id", sa.Integer(), nullable=False),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("architecture", sa.Text(), nullable=True),
        sa.Column("tech_stack", sa.Text(), nullable=True),
        sa.Column("use_cases", sa.Text(), nullable=True),
        sa.Column("limitations", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["repository_id"], ["repositories.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_analyses_repository_id", "analyses", ["repository_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_analyses_repository_id", table_name="analyses")
    op.drop_table("analyses")
    op.drop_index("ix_repositories_user_id", table_name="repositories")
    op.drop_table("repositories")
    op.drop_index("ix_users_username", table_name="users")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
