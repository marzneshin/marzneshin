from typing import List

import sqlalchemy
from fastapi import Depends, HTTPException

from app import app
from app.db import Session, crud, get_db
from app.models.admin import Admin
from app.models.service import (ServiceCreate, ServiceModify,
                                      ServiceResponse)


@app.post("/api/service", tags=['Service'], response_model=ServiceResponse)
def add_service(new_service: ServiceCreate,
                      db: Session = Depends(get_db),
                      admin: Admin = Depends(Admin.get_current)):
    """
    Add a new user template

    - **name** can be up to 64 characters
    - **data_limit** must be in bytes and larger or equal to 0
    - **expire_duration** must be in seconds and larger or equat to 0
    - **inbounds** dictionary of protocol:inbound_tags, empty means all inbounds
    """
    if not (admin.is_sudo):
        raise HTTPException(status_code=403, detail="You're not allowed")
    try:
        return crud.create_service(db, new_service)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Service by this name already exists")


@app.get("/api/service/{id}", tags=['Service'], response_model=ServiceResponse)
def get_service(id: int, db: Session = Depends(get_db), admin: Admin = Depends(Admin.get_current)):
    """
    Get Service information with id
    """
    dbservice = crud.get_service(db, id)
    if not dbservice:
        raise HTTPException(status_code=404, detail="Service not found")

    return dbservice


@app.put("/api/service/{id}", tags=['Service'], response_model=ServiceResponse)
def modify_service(id: int, modify_service: ServiceModify,
                         db: Session = Depends(get_db),
                         admin: Admin = Depends(Admin.get_current)):
    """
    Modify Service

    - **name** can be up to 64 characters
    - **data_limit** must be in bytes and larger or equal to 0
    - **expire_duration** must be in seconds and larger or equat to 0
    - **inbounds** dictionary of protocol:inbound_tags, empty means all inbounds
    """
    if not (admin.is_sudo):
        raise HTTPException(status_code=403, detail="You're not allowed")
    
    dbservice = crud.get_service(db, id)
    if not dbuser_template:
        raise HTTPException(status_code=404, detail="Service not found") 

    try:
        return crud.update_service(db, dbservice, modify_service)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Service by this name already exists")


@app.delete("/api/service/{id}", tags=['Service'])
def remove_service(id: int,
                         db: Session = Depends(get_db),
                         admin: Admin = Depends(Admin.get_current)):
    if not (admin.is_sudo):
        raise HTTPException(status_code=403, detail="You're not allowed")

    dbservice = crud.get_service(db, id)
    if not dbuser_template:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return crud.remove_service(db, dbservice)


@app.get("/api/services", tags=['Service'], response_model=List[ServiceResponse])
def get_services(
        offset: int = None, limit: int = None, db: Session = Depends(get_db),
        admin: Admin = Depends(Admin.get_current)):
    return crud.get_services(db) #, offset, limit)
