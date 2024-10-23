"""nullify username all old deleted users

Revision ID: e8d6daa2ff31
Revises: 1992c49c5990
Create Date: 2024-10-23 23:35:01.691600

"""
from alembic import op


revision = 'e8d6daa2ff31'
down_revision = '1992c49c5990'
branch_labels = None
depends_on = None


def upgrade() -> None:
    connection = op.get_bind()
    dialect = connection.dialect.name

    if dialect in ('mysql', 'mariadb', 'postgresql'):
        op.execute(
            "UPDATE users SET username = NULL WHERE removed = TRUE"
        )
    elif dialect == 'sqlite':
        op.execute(
            "UPDATE users SET username = NULL WHERE removed = 1"
        )


def downgrade() -> None:
    pass