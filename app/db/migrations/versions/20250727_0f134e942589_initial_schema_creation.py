"""Initial schema creation

Revision ID: (your revision ID will be here)
Revises:
Create Date: (the date will be here)

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0f134e942589"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### Create all tables ###
    op.create_table(
        "admins",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=32), nullable=True),
        sa.Column("hashed_password", sa.String(length=128), nullable=True),
        sa.Column("otp_secret", sa.String(length=64), nullable=True),
        sa.Column(
            "is_otp_enabled",
            sa.Boolean(),
            server_default=sa.text("0"),
            nullable=False,
        ),
        sa.Column(
            "enabled",
            sa.Boolean(),
            server_default=sa.text("1"),
            nullable=False,
        ),
        sa.Column(
            "all_services_access",
            sa.Boolean(),
            server_default=sa.text("0"),
            nullable=False,
        ),
        sa.Column(
            "modify_users_access",
            sa.Boolean(),
            server_default=sa.text("1"),
            nullable=False,
        ),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("is_sudo", sa.Boolean(), nullable=True),
        sa.Column("password_reset_at", sa.DateTime(), nullable=True),
        sa.Column(
            "subscription_url_prefix",
            sa.String(length=256),
            server_default=sa.text("''"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_admins_username"), "admins", ["username"], unique=True
    )

    op.create_table(
        "jwt",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("secret_key", sa.String(length=64), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "nodes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=256), nullable=True),
        sa.Column("connection_backend", sa.String(length=32), nullable=True),
        sa.Column("address", sa.String(length=256), nullable=True),
        sa.Column("port", sa.Integer(), nullable=True),
        sa.Column("xray_version", sa.String(length=32), nullable=True),
        sa.Column(
            "status",
            sa.Enum("unhealthy", "healthy", name="nodestatus"),
            nullable=False,
        ),
        sa.Column("last_status_change", sa.DateTime(), nullable=True),
        sa.Column("message", sa.String(length=1024), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("uplink", sa.BigInteger(), nullable=True),
        sa.Column("downlink", sa.BigInteger(), nullable=True),
        sa.Column(
            "usage_coefficient",
            sa.Float(),
            server_default=sa.text("1.0"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("address", "port"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "services",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=64), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "settings",
        sa.Column(
            "id", sa.Integer(), server_default=sa.text("0"), nullable=False
        ),
        sa.Column("subscription", sa.JSON(), nullable=False),
        sa.Column("telegram", sa.JSON(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "system",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("uplink", sa.BigInteger(), nullable=True),
        sa.Column("downlink", sa.BigInteger(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "tls",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("key", sa.String(length=4096), nullable=False),
        sa.Column("certificate", sa.String(length=2048), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "admins_services",
        sa.Column("admin_id", sa.Integer(), nullable=False),
        sa.Column("service_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["admin_id"],
            ["admins.id"],
        ),
        sa.ForeignKeyConstraint(
            ["service_id"],
            ["services.id"],
        ),
        sa.PrimaryKeyConstraint("admin_id", "service_id"),
    )

    op.create_table(
        "backends",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=64), nullable=False),
        sa.Column("node_id", sa.Integer(), nullable=True),
        sa.Column("backend_type", sa.String(length=32), nullable=False),
        sa.Column("version", sa.String(length=32), nullable=True),
        sa.Column("running", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["node_id"],
            ["nodes.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_backends_node_id"), "backends", ["node_id"], unique=False
    )

    op.create_table(
        "inbounds",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column(
            "protocol",
            sa.Enum(
                "vless",
                "vmess",
                "trojan",
                "shadowsocks",
                "socks",
                "http",
                "hysteria2",
                "hysteria",
                "tuic",
                "shadowtls",
                "shadowsocks2022",
                name="proxytypes",
            ),
            nullable=True,
        ),
        sa.Column("tag", sa.String(length=256), nullable=False),
        sa.Column("config", sa.String(length=512), nullable=False),
        sa.Column("node_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["node_id"],
            ["nodes.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("node_id", "tag"),
    )
    op.create_index(
        op.f("ix_inbounds_node_id"), "inbounds", ["node_id"], unique=False
    )

    op.create_table(
        "inbounds_services",
        sa.Column("inbound_id", sa.Integer(), nullable=False),
        sa.Column("service_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["inbound_id"],
            ["inbounds.id"],
        ),
        sa.ForeignKeyConstraint(
            ["service_id"],
            ["services.id"],
        ),
        sa.PrimaryKeyConstraint("inbound_id", "service_id"),
    )

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=32), nullable=True),
        sa.Column("key", sa.String(length=64), nullable=True),
        sa.Column("activated", sa.Boolean(), nullable=False),
        sa.Column(
            "enabled",
            sa.Boolean(),
            server_default=sa.text("1"),
            nullable=False,
        ),
        sa.Column(
            "removed",
            sa.Boolean(),
            server_default=sa.text("0"),
            nullable=False,
        ),
        sa.Column("used_traffic", sa.BigInteger(), nullable=True),
        sa.Column(
            "lifetime_used_traffic",
            sa.BigInteger(),
            server_default="0",
            nullable=False,
        ),
        sa.Column("traffic_reset_at", sa.DateTime(), nullable=True),
        sa.Column("data_limit", sa.BigInteger(), nullable=True),
        sa.Column(
            "data_limit_reset_strategy",
            sa.Enum(
                "no_reset",
                "day",
                "week",
                "month",
                "year",
                name="userdatausageresetstrategy",
            ),
            nullable=False,
        ),
        sa.Column("ip_limit", sa.Integer(), nullable=False),
        sa.Column("settings", sa.String(length=1024), nullable=True),
        sa.Column(
            "expire_strategy",
            sa.Enum(
                "NEVER",
                "FIXED_DATE",
                "START_ON_FIRST_USE",
                name="userexpirestrategy",
            ),
            nullable=False,
        ),
        sa.Column("expire_date", sa.DateTime(), nullable=True),
        sa.Column("usage_duration", sa.BigInteger(), nullable=True),
        sa.Column("activation_deadline", sa.DateTime(), nullable=True),
        sa.Column("admin_id", sa.Integer(), nullable=True),
        sa.Column("sub_updated_at", sa.DateTime(), nullable=True),
        sa.Column("sub_last_user_agent", sa.String(length=512), nullable=True),
        sa.Column("sub_revoked_at", sa.DateTime(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("note", sa.String(length=500), nullable=True),
        sa.Column("online_at", sa.DateTime(), nullable=True),
        sa.Column("edit_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(
            ["admin_id"],
            ["admins.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("key"),
    )
    op.create_index(
        op.f("ix_users_username"), "users", ["username"], unique=True
    )

    op.create_table(
        "node_usages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("node_id", sa.Integer(), nullable=True),
        sa.Column("uplink", sa.BigInteger(), nullable=True),
        sa.Column("downlink", sa.BigInteger(), nullable=True),
        sa.ForeignKeyConstraint(
            ["node_id"],
            ["nodes.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("created_at", "node_id"),
    )

    op.create_table(
        "node_user_usages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("node_id", sa.Integer(), nullable=True),
        sa.Column("used_traffic", sa.BigInteger(), nullable=True),
        sa.ForeignKeyConstraint(
            ["node_id"],
            ["nodes.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("created_at", "user_id", "node_id"),
    )

    op.create_table(
        "users_services",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("service_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["service_id"],
            ["services.id"],
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("user_id", "service_id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("users_services")
    op.drop_table("node_user_usages")
    op.drop_table("node_usages")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_table("users")
    op.drop_index(op.f("ix_inbounds_node_id"), table_name="inbounds")
    op.drop_table("inbounds_services")
    op.drop_table("inbounds")
    op.drop_index(op.f("ix_backends_node_id"), table_name="backends")
    op.drop_table("backends")
    op.drop_table("admins_services")
    op.drop_table("tls")
    op.drop_table("system")
    op.drop_table("settings")
    op.drop_table("services")
    op.drop_table("nodes")
    op.drop_table("jwt")
    op.drop_index(op.f("ix_admins_username"), table_name="admins")
    op.drop_table("admins")
    # ### end Alembic commands ###
