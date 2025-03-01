"""add clients blocked to hosts

Revision ID: c7294e42582e
Revises: 57eba0a293f2
Create Date: 2025-03-02 02:00:28.145362

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql, postgresql, sqlite
import json

revision = "c7294e42582e"
down_revision = "57eba0a293f2"
branch_labels = None
depends_on = None


DEFAULT_CLIENTS_BLOCKED = {
    "sing_box": False,
    "clash_meta": False,
    "clash": False,
    "xray": False,
    "v2ray": False,
    "links": False,
    "wireguard": False,
}


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        clients_block_type = postgresql.JSON(astext_type=sa.Text())
    elif dialect in ("mysql", "mariadb"):
        clients_block_type = mysql.JSON()
    elif dialect == "sqlite":
        clients_block_type = sqlite.JSON()
    else:
        raise ValueError(f"Unsupported database dialect: {dialect}")

    op.add_column(
        "hosts",
        sa.Column(
            "clients_block",
            clients_block_type,
            nullable=True,
            server_default=json.dumps(DEFAULT_CLIENTS_BLOCKED),
        ),
    )

    op.execute(
        f"""
        UPDATE hosts
        SET clients_block = '{json.dumps(DEFAULT_CLIENTS_BLOCKED)}'
        WHERE clients_block IS NULL OR clients_block = 'null' OR clients_block = '';
    """
    )


def downgrade() -> None:
    op.drop_column("hosts", "clients_block")
