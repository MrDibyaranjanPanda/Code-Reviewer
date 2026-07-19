"""Add original_code to reviews

Revision ID: b7c8d9e0f1a2
Revises: d9c54180c3ca
Create Date: 2026-07-19
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7c8d9e0f1a2'
down_revision = 'd9c54180c3ca'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'reviews',
        sa.Column('original_code', sa.Text(), nullable=True)
    )


def downgrade():
    op.drop_column('reviews', 'original_code')