"""change host port type to string

Revision ID: c6975b9a2db9
Revises: a015ed8ce227
Create Date: 2024-12-07 15:39:57.168228

"""

from alembic import op
from sqlalchemy import inspect, text


# revision identifiers, used by Alembic.
revision = "c6975b9a2db9"
down_revision = "a015ed8ce227"
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
