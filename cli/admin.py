from typing import Optional, Union

import typer
from rich.table import Table
from rich.console import Console
from rich.panel import Panel
from sqlalchemy.exc import IntegrityError

from app.db import get_db_session
from app.db import crud
from app.db.models import Admin
from app.models.admin import AdminCreate, AdminPartialModify
from . import utils
from cli.utils import async_to_sync

app = typer.Typer(no_args_is_help=True)


@app.command(name="list")
@async_to_sync
async def list_admins(
    offset: Optional[int] = typer.Option(None, *utils.FLAGS["offset"]),
    limit: Optional[int] = typer.Option(None, *utils.FLAGS["limit"]),
    username: Optional[str] = typer.Option(
        None, *utils.FLAGS["username"], help="Search by username"
    ),
):
    """Displays a table of admins"""
    async for db in get_db_session():
        admins: list[Admin] = await crud.get_admins(
            db, offset=offset, limit=limit, username=username
        )
        utils.print_table(
            table=Table("Username", "Is sudo", "Created at"),
            rows=[
                (
                    str(admin.username),
                    "✔️" if admin.is_sudo else "✖️",
                    utils.readable_datetime(admin.created_at),
                )
                for admin in admins
            ],
        )


@app.command(name="delete")
@async_to_sync
async def delete_admin(
    username: str = typer.Option(..., *utils.FLAGS["username"], prompt=True),
    yes_to_all: bool = typer.Option(
        False, *utils.FLAGS["yes_to_all"], help="Skips confirmations"
    ),
):
    """
    Deletes the specified admin

    Confirmations can be skipped using `--yes/-y` option.
    """
    async for db in get_db_session():
        admin: Union[Admin, None] = await crud.get_admin(db, username=username)
        if not admin:
            utils.error(f'There\'s no admin with username "{username}"!')

        if yes_to_all or typer.confirm(
            f'Are you sure about deleting "{username}"?', default=False
        ):
            await crud.remove_admin(db, admin)
            utils.success(f'"{username}" deleted successfully.')
        else:
            utils.error("Operation aborted!")


@app.command(name="create")
@async_to_sync
async def create_admin(
    username: str = typer.Option(..., *utils.FLAGS["username"], prompt=True),
    is_sudo: bool = typer.Option(None, *utils.FLAGS["is_sudo"], prompt=True),
    password: str = typer.Option(
        ...,
        prompt=True,
        confirmation_prompt=True,
        hide_input=True,
        hidden=True,
    ),
):
    """
    Creates an admin
    """
    async for db in get_db_session():
        try:
            await crud.create_admin(
                db,
                AdminCreate(
                    username=username, password=password, is_sudo=is_sudo
                ),
            )
            utils.success(f'Admin "{username}" created successfully.')
        except IntegrityError:
            utils.error(f'Admin "{username}" already exists!')


@app.command(name="update")
@async_to_sync
async def update_admin(
    username: str = typer.Option(..., *utils.FLAGS["username"], prompt=True)
):
    """
    Updates the specified admin

    NOTE: This command CAN NOT be used non-interactively.
    """

    def _get_modify_model(admin: Admin):
        Console().print(
            Panel(
                f'Editing "{username}". Just press "Enter" to leave each field unchanged.'
            )
        )

        is_sudo: bool = typer.confirm("Is sudo", default=admin.is_sudo)
        new_password: Union[str, None] = (
            typer.prompt(
                "New password",
                default="",
                show_default=False,
                confirmation_prompt=True,
                hide_input=True,
            )
            or None
        )

        return AdminPartialModify(
            is_sudo=is_sudo,
            password=new_password,
        )

    async for db in get_db_session():
        admin: Union[Admin, None] = await crud.get_admin(db, username=username)
        if not admin:
            utils.error(f'There\'s no admin with username "{username}"!')

        await crud.partial_update_admin(db, admin, _get_modify_model(admin))
        utils.success(f'Admin "{username}" updated successfully.')
