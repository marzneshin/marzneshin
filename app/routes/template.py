import sqlalchemy
from fastapi import APIRouter, Query
from fastapi import HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page

from app.db import crud
from app.db.models import Template
from app.dependencies import DBDep, AdminDep, SudoAdminDep
from app.models.template import TemplateCreate, TemplateModify, TemplateResponse

router = APIRouter(prefix="/templates", tags=["Template"])

@router.get("", response_model=Page[TemplateResponse])
def get_templates(db: DBDep, admin: AdminDep, name: str = Query(None)):
    query = db.query(Template)

    if name:
        query = query.filter(Template.name.ilike(f"%{name}%"))

    return paginate(query)



@router.post("", response_model=TemplateResponse)
def add_template(new_template: TemplateCreate, db: DBDep, admin: SudoAdminDep):
    """
    Add a new template

    - **name:** a template name
    - **data_limit:** in bytes (0 for unlimited)
    - **reset_data_usage:** reset user data usage
    """
    try:
        return crud.create_template(db, new_template)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409, detail="Template by this name already exists"
        )
    

@router.get("/{id}", response_model=TemplateResponse)
def get_template(id: int, db: DBDep, admin: AdminDep):
    """
    Get Template information with id
    """
    dbtemplate = crud.get_template(db, id)
    if not dbtemplate:
        raise HTTPException(status_code=404, detail="Template not found")

    return dbtemplate


@router.put("/{id}", response_model=TemplateResponse)
async def modify_template(
    id: int, modification: TemplateModify, db: DBDep, admin: SudoAdminDep
):
    """
    Modify Template
    """
    dbtemplate = crud.get_service(db, id)
    if not dbtemplate:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return crud.update_template(db, id, modification)

@router.delete("/{id}")
def remove_template(id: int, db: DBDep, admin: SudoAdminDep):
    dbtemplate = crud.get_template(db, id)
    if not dbtemplate:
        raise HTTPException(status_code=404, detail="Template not found")

    crud.remove_template(db, dbtemplate)
    return dict()
