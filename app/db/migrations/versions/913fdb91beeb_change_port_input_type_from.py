"""change port input type from

Revision ID: 913fdb91beeb
Revises: 1992c49c5990
Create Date: 2024-10-12 04:59:01.544686

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect, text
from alembic.context import get_context


# revision identifiers, used by Alembic.
revision = "913fdb91beeb"
down_revision = "1992c49c5990"
branch_labels = None
depends_on = None


def get_db_type():
    conn = op.get_bind()
    inspector = inspect(conn)
    return inspector.engine.name


def column_exists(table, column):
    conn = op.get_bind()
    insp = inspect(conn)
    return column in [c["name"] for c in insp.get_columns(table)]


def safe_execute(statement):
    try:
        op.execute(statement)
    except Exception as e:
        print(f"Warning: {e}")


def upgrade():
    db_type = get_db_type()

    if db_type == "postgresql":
        if column_exists("hosts", "port"):
            safe_execute(
                text(
                    "ALTER TABLE hosts ALTER COLUMN port TYPE VARCHAR(256) USING port::varchar"
                )
            )
        if column_exists("hosts", "address"):
            safe_execute(
                text(
                    "ALTER TABLE hosts ALTER COLUMN address TYPE VARCHAR(1024)"
                )
            )
    elif db_type in ["mysql", "mariadb"]:
        if column_exists("hosts", "port"):
            safe_execute(
                text("ALTER TABLE hosts MODIFY COLUMN port VARCHAR(256)")
            )
        if column_exists("hosts", "address"):
            safe_execute(
                text("ALTER TABLE hosts MODIFY COLUMN address VARCHAR(1024)")
            )
    elif db_type == "sqlite":
        with op.batch_alter_table("hosts", recreate="always") as batch_op:
            if column_exists("hosts", "port"):
                batch_op.alter_column(
                    "port",
                    existing_type=sa.INTEGER(),
                    type_=sa.String(length=256),
                )
            if column_exists("hosts", "address"):
                batch_op.alter_column(
                    "address",
                    existing_type=sa.String(length=256),
                    type_=sa.String(length=1024),
                )
    else:
        print(f"Unsupported database type: {db_type}")


def downgrade():
    db_type = get_db_type()

    if db_type == "postgresql":
        if column_exists("hosts", "port"):
            safe_execute(
                text(
                    "ALTER TABLE hosts ALTER COLUMN port TYPE INTEGER USING port::integer"
                )
            )
        if column_exists("hosts", "address"):
            safe_execute(
                text(
                    "ALTER TABLE hosts ALTER COLUMN address TYPE VARCHAR(256)"
                )
            )
    elif db_type in ["mysql", "mariadb"]:
        if column_exists("hosts", "port"):
            safe_execute(text("ALTER TABLE hosts MODIFY COLUMN port INTEGER"))
        if column_exists("hosts", "address"):
            safe_execute(
                text("ALTER TABLE hosts MODIFY COLUMN address VARCHAR(256)")
            )
    elif db_type == "sqlite":
        with op.batch_alter_table("hosts", recreate="always") as batch_op:
            if column_exists("hosts", "port"):
                batch_op.alter_column(
                    "port",
                    existing_type=sa.String(length=256),
                    type_=sa.INTEGER(),
                )
            if column_exists("hosts", "address"):
                batch_op.alter_column(
                    "address",
                    existing_type=sa.String(length=1024),
                    type_=sa.String(length=256),
                )
    else:
        print(f"Unsupported database type: {db_type}")
