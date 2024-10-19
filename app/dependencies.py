from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException, status

from app.db import AsyncSession, get_db_session, crud, User
from app.models.admin import Admin, oauth2_scheme
from app.utils.auth import get_admin_payload


async def get_admin(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    token: Annotated[str, Depends(oauth2_scheme)],
):
    payload = await get_admin_payload(token)
    if not payload:
        return

    dbadmin = await crud.get_admin(db, payload["username"])
    if not dbadmin:
        return

    if dbadmin.password_reset_at:
        created_at = payload.get("created_at")
        if not created_at or dbadmin.password_reset_at > created_at:
            return

    if not dbadmin.is_sudo and not dbadmin.enabled:
        return

    return Admin.model_validate(dbadmin)


async def get_current_admin(admin: Annotated[Admin, Depends(get_admin)]):
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return admin


async def sudo_admin(admin: Annotated[Admin, Depends(get_current_admin)]):
    if not admin.is_sudo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied",
        )
    return admin


async def get_subscription_user(
    username: str,
    key: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
):
    try:
        int(key, 16)
    except ValueError:
        raise HTTPException(status_code=404)

    db_user = await crud.get_user(db, username)
    if db_user and db_user.key == key:
        return db_user
    else:
        raise HTTPException(status_code=404)


async def get_user(
    username: str,
    admin: Annotated[Admin, Depends(get_current_admin)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
):
    db_user = await crud.get_user(db, username)
    if not (
        admin.is_sudo or (db_user and db_user.admin.username == admin.username)
    ):
        raise HTTPException(status_code=403, detail="You're not allowed")

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


async def user_modification_access(
    admin: Annotated[Admin, Depends(get_current_admin)]
):
    if not admin.is_sudo and not admin.modify_users_access:
        raise HTTPException(status_code=403, detail="You're not allowed")


def parse_start_date(start: str | None = None):
    if not start:
        return datetime.fromtimestamp(
            datetime.utcnow().timestamp() - 30 * 24 * 3600
        )
    else:
        return datetime.fromisoformat(start)


def parse_end_date(end: str | None = None):
    if not end:
        return datetime.utcnow()
    else:
        return datetime.fromisoformat(end)


SubUserDep = Annotated[User, Depends(get_subscription_user)]
UserDep = Annotated[User, Depends(get_user)]
AdminDep = Annotated[Admin, Depends(get_current_admin)]
SudoAdminDep = Annotated[Admin, Depends(sudo_admin)]
DBDep = Annotated[AsyncSession, Depends(get_db_session)]
StartDateDep = Annotated[datetime, Depends(parse_start_date)]
EndDateDep = Annotated[datetime, Depends(parse_end_date)]
ModifyUsersAccess = Annotated[None, Depends(user_modification_access)]
