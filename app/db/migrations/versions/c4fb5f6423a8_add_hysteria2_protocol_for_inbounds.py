"""add hysteria2 protocol for inbounds

Revision ID: c4fb5f6423a8
Revises: 5410d8ec78ff
Create Date: 2024-07-28 13:07:18.388141

"""

import sqlalchemy as sa
from alembic import op

enum_name = "proxytypes"
temp_enum_name = f"temp_{enum_name}"
old_values = ("VMess", "VLESS", "Trojan", "Shadowsocks")
new_values = ("Hysteria2", *old_values)
# on downgrade convert [0] to [1]
downgrade_from = ["Hysteria2"]
downgrade_to = "VLess"
old_type = sa.Enum(*old_values, name=enum_name)
new_type = sa.Enum(*new_values, name=enum_name)
temp_type = sa.Enum(*new_values, name=temp_enum_name)


# Describing of table
table_name = "inbounds"
column_name = "protocol"
temp_table = sa.sql.table(
    table_name, sa.Column(column_name, new_type, nullable=False)
)


# revision identifiers, used by Alembic.
revision = "c4fb5f6423a8"
down_revision = "5410d8ec78ff"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # temp type to use instead of old one
    temp_type.create(op.get_bind())

    # changing of column type from old enum to new one.
    # SQLite will create temp table for this
    with op.batch_alter_table(table_name) as batch_op:
        batch_op.alter_column(
            column_name,
            existing_type=old_type,
            type_=temp_type,
            existing_nullable=False,
            postgresql_using=f"{column_name}::text::{temp_enum_name}",
        )

    # remove old enum, create new enum
    old_type.drop(op.get_bind())
    new_type.create(op.get_bind())

    # changing of column type from temp enum to new one.
    # SQLite will create temp table for this
    with op.batch_alter_table(table_name) as batch_op:
        batch_op.alter_column(
            column_name,
            existing_type=temp_type,
            type_=new_type,
            existing_nullable=False,
            postgresql_using=f"{column_name}::text::{enum_name}",
        )

    # remove temp enum
    temp_type.drop(op.get_bind())


def downgrade() -> None:
    pass
