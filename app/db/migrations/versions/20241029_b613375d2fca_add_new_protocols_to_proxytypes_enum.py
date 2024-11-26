"""add new protocols to ProxyTypes enum

Revision ID: b613375d2fca
Revises: 1992c49c5990
Create Date: 2024-10-29 23:22:08.887104

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "b613375d2fca"
down_revision = "1992c49c5990"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        op.execute("ALTER TYPE proxytypes ADD VALUE 'Shadowsocks2022'")
        op.execute("ALTER TYPE proxytypes ADD VALUE 'WireGuard'")
        op.execute("ALTER TYPE proxytypes ADD VALUE 'TUIC'")
    elif dialect in ("mariadb", "mysql"):
        op.execute(
            "ALTER TABLE inbounds MODIFY protocol ENUM('VMess', 'VLESS', 'Trojan', 'Shadowsocks', 'Shadowsocks2022', 'Hysteria2', 'WireGuard', 'TUIC')"
        )


def downgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect in ("mysql", "mariadb"):
        op.execute(
            "ALTER TABLE inbounds MODIFY protocol ENUM('VMess', 'VLESS', 'Shadowsocks', 'Trojan', 'Hysteria2')"
        )
