"""add interview_questions to analyses

Revision ID: e69bb8b703af
Revises: ae1ec85761ad
Create Date: 2026-08-09 02:36:49.700003
"""
from alembic import op
import sqlalchemy as sa



revision = 'e69bb8b703af'
down_revision = 'ae1ec85761ad'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('analyses', sa.Column('interview_questions', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('analyses', 'interview_questions')