from fastapi import APIRouter, Depends
from fastapi import HTTPException

from app.db import crud
from app.dependencies import DBDep, sudo_admin
from app.models.proxy import Inbound, InboundHost, InboundHostResponse
from app.db.models import InboundHost as DBInboundHost

router = APIRouter(prefix="/inbounds", dependencies=[Depends(sudo_admin)], tags=['Inbounds'])


@router.get("", response_model=list[Inbound])
def get_inbounds(db: DBDep):
    """
    Get all inbounds
    """
    inbounds = crud.get_all_inbounds(db)

    return inbounds


@router.get('/hosts', response_model=list[InboundHost])
def get_hosts(db: DBDep):
    return db.query(DBInboundHost).all()


@router.put("/hosts/{id}", response_model=InboundHostResponse)
def update_host(id: int, host: InboundHost, db: DBDep):
    """
    Modify a host
    """

    db_host = crud.get_host(db, id)
    if not db_host:
        raise HTTPException(status_code=404, detail="Host not found")

    return crud.update_host(db, db_host, host)


@router.delete("/hosts/{id}")
def delete_host(id: int, db: DBDep):
    """
    Remove a host
    """
    db_host = crud.get_host(db, id)
    if not db_host:
        raise HTTPException(status_code=404, detail="Host not found")

    db.delete(db_host)
    db.commit()
    return {}


@router.get("/{id}", response_model=Inbound)
def get_inbound(id: int, db: DBDep):
    """
    Get a specific inbound
    """
    inbound = crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return inbound


@router.get("/{id}/hosts", response_model=list[InboundHostResponse])
def get_inbound_hosts(id: int | None, db: DBDep):
    """
    Get hosts of a specific inbound
    """
    if not id:
        print()
        return
    inbound = crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return inbound.hosts


@router.post("/{id}/hosts", response_model=InboundHostResponse)
def create_host(id: int, host: InboundHost, db: DBDep):
    """
    Add a host to the inbound
    """
    inbound = crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return crud.add_host(db, inbound, host)
