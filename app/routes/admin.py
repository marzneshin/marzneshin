import sqlalchemy
from fastapi import APIRouter
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

from app.db import crud
from app.db.models import Admin as DBAdmin
from app.dependencies import AdminDep, SudoAdminDep, DBDep
from app.models.admin import Admin, AdminCreate, AdminModify

router = APIRouter(tags=["Admin"], prefix="/admins")


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
            detail="You're not allowed to edit another sudoers account. Use marzneshin-cli instead.",
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
            detail="You're not allowed to delete sudoers accounts. Use marzneshin-cli instead.",
        )

    crud.remove_admin(db, dbadmin)
    return {}
