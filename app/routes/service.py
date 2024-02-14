from typing import List

import sqlalchemy
from fastapi import APIRouter, Depends
from fastapi import HTTPException

from app.db import crud
from app.dependencies import DBDep, sudo_admin
from app.models.service import (ServiceCreate, ServiceModify,
                                ServiceResponse)

router = APIRouter(dependencies=[Depends(sudo_admin)], tags=['Service'])


@router.post("/service", response_model=ServiceResponse)
def add_service(new_service: ServiceCreate,
                db: DBDep):
    """
    Add a new user template

    - **name** can be up to 64 characters
    - **data_limit** must be in bytes and larger or equal to 0
    - **expire_duration** must be in seconds and larger or equal to 0
    - **inbounds** dictionary of protocol:inbound_tags, empty means all inbounds
    """
    try:
        return crud.create_service(db, new_service)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Service by this name already exists")


@router.get("/service/{id}", response_model=ServiceResponse)
def get_service(id: int, db: DBDep):
    """
    Get Service information with id
    """
    dbservice = crud.get_service(db, id)
    if not dbservice:
        raise HTTPException(status_code=404, detail="Service not found")

    return dbservice


@router.put("/service/{id}", response_model=ServiceResponse)
def modify_service(id: int,
                   modification: ServiceModify,
                   db: DBDep):
    """
    Modify Service

    - **name** can be up to 64 characters
    - **data_limit** must be in bytes and larger or equal to 0
    - **expire_duration** must be in seconds and larger or equat to 0
    - **inbounds** list of inbound ids. if not specified no change will be applied;
    in case of an empty list all inbounds would be removed.
    """
    # TODO: Update all affected users in nodes
    dbservice = crud.get_service(db, id)
    if not dbservice:
        raise HTTPException(status_code=404, detail="Service not found") 

    try:
        return crud.update_service(db, dbservice, modification)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Service by this name already exists")


@router.delete("/service/{id}")
def remove_service(id: int,
                   db: DBDep):
    dbservice = crud.get_service(db, id)
    if not dbservice:
        raise HTTPException(status_code=404, detail="Service not found")
    
    crud.remove_service(db, dbservice)
    return dict()


@router.get("/services", response_model=List[ServiceResponse])
def get_services(db: DBDep,
                 offset: int = None,
                 limit: int = None):
    return crud.get_services(db)  # , offset, limit)
