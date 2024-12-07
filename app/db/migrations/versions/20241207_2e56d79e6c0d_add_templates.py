"""add templates

Revision ID: 2e56d79e6c0d
Revises: a015ed8ce227
Create Date: 2024-12-07 05:30:52.099333

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2e56d79e6c0d'
down_revision = 'a015ed8ce227'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('templates',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('remark', sa.String(length=32), nullable=False),
    sa.Column('data_limit', sa.BigInteger(), nullable=True),
    sa.Column('data_limit_reset_strategy', sa.Enum('no_reset', 'day', 'week', 'month', 'year', name='userdatausageresetstrategy'), nullable=False),
    sa.Column('expire_strategy', sa.Enum('NEVER', 'FIXED_DATE', 'START_ON_FIRST_USE', name='userexpirestrategy'), nullable=False),
    sa.Column('expire_date', sa.Integer(), nullable=True),
    sa.Column('usage_duration', sa.BigInteger(), nullable=True),
    sa.Column('activation_deadline', sa.Integer(), nullable=True),
    sa.Column('reset_data_usage', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('templates')
    # ### end Alembic commands ###
