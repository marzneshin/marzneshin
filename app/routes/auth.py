from typing import Optional, Annotated

from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from starlette import status

from app.db import crud
from app.dependencies import DBDep, get_admin
from app.models.admin import Token, Admin, AdminInDB
from app.utils.auth import create_access_token, create_refresh_token

router = APIRouter(tags=["Authentication"], prefix="/auth")


def authenticate_admin(db: Session, username: str, password: str) -> Optional[Admin]:
    dbadmin = crud.get_admin(db, username)
    if not dbadmin:
        return None

    return (
        dbadmin if AdminInDB.model_validate(dbadmin).verify_password(password) else None
    )


@router.post("/login", response_model=Token)
def admin_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: DBDep):
    if dbadmin := authenticate_admin(db, form_data.username, form_data.password):
        return {
            "access_token": create_access_token(dbadmin.username, dbadmin.is_sudo),
            "refresh_token": create_refresh_token(dbadmin.username, dbadmin.is_sudo),
            "is_sudo": dbadmin.is_sudo,
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/refresh")
def admin_token(refresh_token: str, db: DBDep):
    if dbadmin := get_admin(db, refresh_token, token_type="refresh"):
        return {
            "access_token": create_access_token(dbadmin.username, dbadmin.is_sudo),
            "is_sudo": dbadmin.is_sudo,
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
