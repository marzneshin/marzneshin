from fastapi import APIRouter, Depends
from fastapi import HTTPException

from app.db import crud
from app.dependencies import DBDep, sudo_admin
from app.models.proxy import Inbound, InboundHost

router = APIRouter(prefix="/inbounds", dependencies=[Depends(sudo_admin)], tags=['Inbounds'])


@router.get("", response_model=list[Inbound])
def get_inbounds(db: DBDep):
    """
    Get all inbounds
    """
    dbservice = crud.get_all_inbounds(db)

    return dbservice


@router.get("/{id}", response_model=Inbound)
def get_inbound(id: int, db: DBDep):
    """
    Get a specific inbound
    """
    dbservice = crud.get_inbound(db, id)
    if not dbservice:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return dbservice


@router.get("/{id}/hosts", response_model=list[InboundHost])
def get_inbound_hosts(id: int, db: DBDep):
    """
    Get hosts of a specific inbound
    """
    dbservice = crud.get_inbound_hosts(db, id)
    if not dbservice:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return dbservice


@router.post("/{id}/hosts", response_model=InboundHost)
def get_inbound_hosts(id: int, host: InboundHost, db: DBDep):
    """
    Add a host to the inbound
    """
    inbound = crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    crud.add_host(db, inbound, host)
    inbound
