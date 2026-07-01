"""add users.avatar

Revision ID: 20260701_add_users_avatar
Revises: 96538496a01e
Create Date: 2026-07-01 11:20:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '20260701_add_users_avatar'
down_revision = '96538496a01e'
branch_labels = None
depends_on = None


def upgrade():
    # Add the avatar column if it doesn't exist already
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar', sa.Text(), nullable=True))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('avatar')
