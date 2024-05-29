from typing import Optional, Annotated

import sqlalchemy
from fastapi import APIRouter
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from app.db import Session, crud
from app.db.models import Admin as DBAdmin
from app.dependencies import AdminDep, SudoAdminDep, DBDep
from app.models.admin import Admin, AdminCreate, AdminInDB, AdminModify, Token
from app.utils.auth import create_admin_token

router = APIRouter(tags=["Admin"], prefix="/admins")


def authenticate_admin(db: Session, username: str, password: str) -> Optional[Admin]:
    dbadmin = crud.get_admin(db, username)
    if not dbadmin:
        return None

    return (
        dbadmin if AdminInDB.model_validate(dbadmin).verify_password(password) else None
    )


@router.get("", response_model=Page[Admin])
def get_admins(db: DBDep, admin: SudoAdminDep, username: str = None):
    query = db.query(DBAdmin)
    if username:
        query = query.filter(DBAdmin.username.ilike(f"%{username}%"))
    return paginate(db, query)


@router.post("", response_model=Admin)
def create_admin(new_admin: AdminCreate, db: DBDep, admin: SudoAdminDep):
    try:
        dbadmin = crud.create_admin(db, new_admin)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Admin already exists")

    return dbadmin


@router.get("/current", response_model=Admin)
def get_current_admin(admin: AdminDep):
    return admin


@router.post("/token", response_model=Token)
def admin_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DBDep):
    if dbadmin := authenticate_admin(db, form_data.username, form_data.password):
        return Token(
            access_token=create_admin_token(form_data.username, is_sudo=dbadmin.is_sudo)
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.put("/{username}", response_model=Admin)
def modify_admin(
    username: str, modified_admin: AdminModify, db: DBDep, admin: AdminDep
):
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


@router.delete("/{username}")
def remove_admin(username: str, db: DBDep, admin: SudoAdminDep):
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
