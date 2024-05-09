"""Add enabled to users

Revision ID: e8325f600a49
Revises: 20faa9f18c0a
Create Date: 2024-05-01 13:39:53.944195

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e8325f600a49"
down_revision = "20faa9f18c0a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "users",
        sa.Column(
            "enabled", sa.Boolean(), server_default=sa.sql.true(), nullable=False
        ),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "enabled")
    # ### end Alembic commands ###
