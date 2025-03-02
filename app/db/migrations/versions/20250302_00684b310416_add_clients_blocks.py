"""add clients blocks

Revision ID: 00684b310416
Revises: 57eba0a293f2
Create Date: 2025-03-02 21:34:56.128692

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "00684b310416"
down_revision = "57eba0a293f2"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "hosts",
        sa.Column(
            "clients_block",
            sa.String,
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column("hosts", "clients_block")
