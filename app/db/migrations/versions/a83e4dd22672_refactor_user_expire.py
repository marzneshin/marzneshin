"""refactor user expire

Revision ID: a83e4dd22672
Revises: 9001356f0063
Create Date: 2024-06-27 01:04:34.974520

"""

import sqlalchemy as sa
from alembic import op
from sqlalchemy import table, column
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "a83e4dd22672"
down_revision = "9001356f0063"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        op.execute(
            "CREATE TYPE userexpirestrategy AS ENUM ('NEVER', 'FIXED_DATE', 'START_ON_FIRST_USE')"
        )

    op.add_column(
        "users",
        sa.Column(
            "activated",
            sa.Boolean(),
            nullable=False,
            server_default=sa.sql.true(),
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "expire_strategy",
            sa.Enum(
                "NEVER",
                "FIXED_DATE",
                "START_ON_FIRST_USE",
                name="userexpirestrategy",
            ),
            nullable=True,
        ),
    )

    op.alter_column(
        "users", "on_hold_timeout", new_column_name="activation_deadline"
    )
    op.alter_column("users", "expire", new_column_name="expire_date")
    op.alter_column(
        "users", "on_hold_expire_duration", new_column_name="usage_duration"
    )
    # ### end Alembic commands ###
    users_table = table(
        "users",
        column("id", sa.Integer),
        column("status", sa.String),
        column("expire_date", sa.DateTime),
        column("expire_strategy", sa.Enum(name="userexpirestrategy")),
    )

    connection = op.get_bind()
    results = connection.execute(
        sa.select(
            users_table.c.id, users_table.c.status, users_table.c.expire_date
        )
    )

    for user in results:
        status = user[1]
        expire_date = user[2]

        if status == "on_hold":
            expire_strategy = "START_ON_FIRST_USE"
        elif expire_date:
            expire_strategy = "FIXED_DATE"
        else:
            expire_strategy = "NEVER"
        connection.execute(
            users_table.update()
            .where(users_table.c.id == user[0])
            .values(expire_strategy=expire_strategy)
        )

    # Step 3: Make the new column non-nullable if needed
    op.alter_column("users", "expire_strategy", nullable=False)

    op.drop_column("users", "status")


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "users",
        sa.Column(
            "status",
            postgresql.ENUM(
                "active", "limited", "expired", "on_hold", name="userstatus"
            ),
            autoincrement=False,
            nullable=False,
        ),
    )
    op.alter_column(
        "users", "activation_deadline", new_column_name="on_hold_timeout"
    )
    op.alter_column(
        "users", "usage_duration", new_column_name="on_hold_expire_duration"
    )
    op.alter_column("users", "expire_date", new_column_name="expire")
    op.drop_column("users", "expire_strategy")
    op.drop_column("users", "activated")
    # ### end Alembic commands ###
