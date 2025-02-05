"""nullify username all old deleted users

Revision ID: e8d6daa2ff31
Revises: 1992c49c5990
Create Date: 2024-10-23 23:35:01.691600

"""

from alembic import op
import sqlalchemy as sa


revision = "e8d6daa2ff31"
down_revision = "1992c49c5990"
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    dialect = connection.dialect.name

    if dialect in ("mysql", "mariadb", "postgresql"):
        op.execute(
            sa.update("users")
            .where(sa.column("removed").is_(True))
            .values(username=None)
        )
    elif dialect == "sqlite":
        op.execute(
            sa.update("users")
            .where(sa.column("removed") == 1)
            .values(username=None)
        )


def downgrade() -> None:
    pass
