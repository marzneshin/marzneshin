from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page

from app.db import crud
from app.db.models import InboundHost as DBInboundHost, Inbound as DBInbound
from app.dependencies import DBDep, sudo_admin
from app.models.proxy import Inbound, InboundHost, InboundHostResponse

HOST_NOT_FOUND_ERROR_MSG = "Host not found"

router = APIRouter(
    prefix="/inbounds", dependencies=[Depends(sudo_admin)], tags=["Inbounds"]
)


@router.get("", response_model=Page[Inbound])
def get_inbounds(db: DBDep, tag: str = Query(None)):
    """
    Get all inbounds
    """
    query = db.query(DBInbound)
    if tag:
        query = query.filter(DBInbound.tag.ilike(f"%{tag}%"))

    return paginate(db, query)


@router.get("/hosts", response_model=Page[InboundHostResponse])
def get_hosts(db: DBDep):
    return paginate(db.query(DBInboundHost))


@router.post("/hosts", response_model=InboundHostResponse)
def create_unbound_host(host: InboundHost, db: DBDep):
    """
    Add a host without an inbound
    """
    return crud.add_host(db, None, host)


@router.get("/hosts/{id}", response_model=InboundHostResponse)
def get_host(id: int, db: DBDep):
    """
    Get a host
    """
    host = crud.get_host(db, id)
    if not host:
        raise HTTPException(status_code=404, detail=HOST_NOT_FOUND_ERROR_MSG)

    return host


@router.put("/hosts/{id}", response_model=InboundHostResponse)
def update_host(id: int, host: InboundHost, db: DBDep):
    """
    Modify a host
    """

    db_host = crud.get_host(db, id)
    if not db_host:
        raise HTTPException(status_code=404, detail=HOST_NOT_FOUND_ERROR_MSG)

    return crud.update_host(db, db_host, host)


@router.delete("/hosts/{id}")
def delete_host(id: int, db: DBDep):
    """
    Remove a host
    """
    db_host = crud.get_host(db, id)
    if not db_host:
        raise HTTPException(status_code=404, detail=HOST_NOT_FOUND_ERROR_MSG)

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


@router.get("/{id}/hosts", response_model=Page[InboundHostResponse])
def get_inbound_hosts(id: int, db: DBDep):
    """
    Get hosts of a specific inbound
    """
    inbound = crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return paginate(
        db, db.query(DBInboundHost).filter(DBInboundHost.inbound_id == id)
    )


@router.post("/{id}/hosts", response_model=InboundHostResponse)
def create_host(id: int, host: InboundHost, db: DBDep):
    """
    Add a host to the inbound
    """
    inbound = crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return crud.add_host(db, inbound, host)
