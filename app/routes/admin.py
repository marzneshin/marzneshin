from typing import List, Optional, Annotated

import sqlalchemy
from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.db import Session, crud
from app.dependencies import AdminDep, SudoAdminDep, DBDep
from app.models.admin import Admin, AdminCreate, AdminInDB, AdminModify, Token
from app.utils.jwt import create_admin_token
from config import SUDOERS

router = APIRouter(tags=["Admin"])


def authenticate_env_sudo(username: str, password: str) -> bool:
    try:
        return password == SUDOERS[username]
    except KeyError:
        return False


def authenticate_admin(db: Session, username: str, password: str) -> Optional[Admin]:
    dbadmin = crud.get_admin(db, username)
    if not dbadmin:
        return None

    return dbadmin if AdminInDB.model_validate(dbadmin).verify_password(password) else None


@router.post("/admin/token", response_model=Token)
def admin_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
                db: DBDep):
    if authenticate_env_sudo(form_data.username, form_data.password):
        return Token(access_token=create_admin_token(form_data.username, is_sudo=True))

    if dbadmin := authenticate_admin(db, form_data.username, form_data.password):
        return Token(access_token=create_admin_token(form_data.username, is_sudo=dbadmin.is_sudo))

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/admin", response_model=Admin)
def create_admin(new_admin: AdminCreate,
                 db: DBDep,
                 admin: SudoAdminDep):
    try:
        dbadmin = crud.create_admin(db, new_admin)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Admin already exists")

    return dbadmin


@router.put("/admin/{username}", response_model=Admin)
def modify_admin(username: str,
                 modified_admin: AdminModify,
                 db: DBDep,
                 admin: AdminDep):
    if not (admin.is_sudo or admin.username == username):
        raise HTTPException(status_code=403, detail="You're not allowed")

    # If a non-sudoer admin is making itself a sudoer
    if (admin.username == username) and (modified_admin.is_sudo and not admin.is_sudo):
        raise HTTPException(status_code=403, detail="You can't make yourself sudoer!")

    dbadmin = crud.get_admin(db, username)
    if not dbadmin:
        raise HTTPException(status_code=404, detail="Admin not found")

    # If a sudoer admin wants to edit another sudoer
    if (username != admin.username) and dbadmin.is_sudo:
        raise HTTPException(
            status_code=403,
            detail="You're not allowed to edit another sudoers account. Use marzban-cli instead.",
        )

    dbadmin = crud.update_admin(db, dbadmin, modified_admin)
    return dbadmin


@router.delete("/admin/{username}")
def remove_admin(username: str,
                 db: DBDep,
                 admin: SudoAdminDep):
    dbadmin = crud.get_admin(db, username)
    if not dbadmin:
        raise HTTPException(status_code=404, detail="Admin not found")

    if dbadmin.is_sudo:
        raise HTTPException(
            status_code=403,
            detail="You're not allowed to delete sudoers accounts. Use marzban-cli instead.",
        )

    crud.remove_admin(db, dbadmin)
    return {}


@router.get("/admin", response_model=Admin)
def get_current_admin(admin: AdminDep):
    return admin


@router.get("/admins", response_model=List[Admin])
def get_admins(db: DBDep,
               admin: SudoAdminDep,
               offset: int = None,
               limit: int = None,
               username: str = None):
    return crud.get_admins(db, offset, limit, username)
