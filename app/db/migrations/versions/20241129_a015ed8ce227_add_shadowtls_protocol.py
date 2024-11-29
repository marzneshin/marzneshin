"""add shadowtls protocol

Revision ID: a015ed8ce227
Revises: be0032100c07
Create Date: 2024-11-29 21:41:06.896405

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "a015ed8ce227"
down_revision = "be0032100c07"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        op.execute("ALTER TYPE proxytypes ADD VALUE 'ShadowTLS'")

    elif dialect in ("mariadb", "mysql"):
        op.execute(
            "ALTER TABLE inbounds MODIFY protocol ENUM('VMess', 'VLESS', 'Trojan', 'Shadowsocks', 'Shadowsocks2022', 'Hysteria2', 'WireGuard', 'TUIC', 'ShadowTLS')"
        )


def downgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect in ("mysql", "mariadb"):
        op.execute(
            "ALTER TABLE inbounds MODIFY protocol ENUM('VMess', 'VLESS', 'Trojan', 'Shadowsocks', 'Shadowsocks2022', 'Hysteria2', 'WireGuard', 'TUIC')"
        )
