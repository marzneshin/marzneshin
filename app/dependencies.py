from datetime import datetime
from typing import Annotated

from fastapi import Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.db import crud, User, GetDB
from app.models.admin import Admin, oauth2_scheme
from app.utils.jwt import get_admin_payload
from config import SUDOERS


def get_db():  # Dependency
    with GetDB() as db:
        yield db


def get_admin(db: Annotated[Session, Depends(get_db)],
              token: Annotated[str, Depends(oauth2_scheme)]):
    payload = get_admin_payload(token)
    if not payload:
        return

    if payload['username'] in SUDOERS and payload['is_sudo'] is True:
        return Admin(username=payload['username'], is_sudo=True)

    dbadmin = crud.get_admin(db, payload['username'])
    if not dbadmin:
        return

    if dbadmin.password_reset_at:
        if not payload.get("created_at"):
            return
        if dbadmin.password_reset_at > payload.get("created_at"):
            return

    return Admin.model_validate(dbadmin)


def get_current_admin(admin: Annotated[Admin, Depends(get_admin)]):
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return admin


def sudo_admin(admin: Annotated[Admin, Depends(get_current_admin)]):
    if not admin.is_sudo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied",
        )
    return admin


def get_subscription_user(username: str, key: str, db: Annotated[Session, Depends(get_db)]):
    try:
        int(key, 16)
    except ValueError:
        raise HTTPException(404)

    db_user = crud.get_user(db, username)
    if not db_user or db_user.key != key:
        raise HTTPException(404)
    return db_user


def get_user(username: str,
             admin: Annotated[Admin, Depends(get_current_admin)],
             db: Annotated[Session, Depends(get_db)]):
    db_user = crud.get_user(db, username)
    if not (admin.is_sudo or (db_user.admin and db_user.admin.username == admin.username)):
        raise HTTPException(status_code=403, detail="You're not allowed")

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user


def parse_start_date(start: str | None = None):
    if not start:
        return datetime.fromtimestamp(datetime.utcnow().timestamp() - 30 * 24 * 3600)
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
DBDep = Annotated[Session, Depends(get_db)]
StartDateDep = Annotated[datetime, Depends(parse_start_date)]
EndDateDep = Annotated[datetime, Depends(parse_end_date)]
