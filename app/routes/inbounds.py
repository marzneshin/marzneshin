from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page
import sqlalchemy as sa

from app.db import crud
from app.db.models import InboundHost as DBInboundHost, Inbound as DBInbound
from app.dependencies import DBDep, sudo_admin
from app.models.proxy import Inbound, InboundHost, InboundHostResponse

HOST_NOT_FOUND_ERROR_MSG = "Host not found"

router = APIRouter(
    prefix="/inbounds", dependencies=[Depends(sudo_admin)], tags=["Inbounds"]
)


@router.get("", response_model=Page[Inbound])
async def get_inbounds(db: DBDep, tag: str = Query(None)):
    """
    Get all inbounds
    """
    query = sa.select(DBInbound)
    if tag:
        query = query.filter(DBInbound.tag.ilike(f"%{tag}%"))

    return await paginate(db, query)


@router.get("/hosts", response_model=Page[InboundHostResponse])
async def get_hosts(db: DBDep):
    return await paginate(db, sa.select(DBInboundHost))


@router.get("/hosts/{id}", response_model=InboundHostResponse)
async def get_host(id: int, db: DBDep):
    """
    Get a host
    """
    host = await crud.get_host(db, id)
    if not host:
        raise HTTPException(status_code=404, detail=HOST_NOT_FOUND_ERROR_MSG)

    return host


@router.put("/hosts/{id}", response_model=InboundHostResponse)
async def update_host(id: int, host: InboundHost, db: DBDep):
    """
    Modify a host
    """

    db_host = await crud.get_host(db, id)
    if not db_host:
        raise HTTPException(status_code=404, detail=HOST_NOT_FOUND_ERROR_MSG)

    return await crud.update_host(db, db_host, host)


@router.delete("/hosts/{id}")
async def delete_host(id: int, db: DBDep):
    """
    Remove a host
    """
    db_host = await crud.get_host(db, id)
    if not db_host:
        raise HTTPException(status_code=404, detail=HOST_NOT_FOUND_ERROR_MSG)

    await db.delete(db_host)
    await db.commit()
    return {}


@router.get("/{id}", response_model=Inbound)
async def get_inbound(id: int, db: DBDep):
    """
    Get a specific inbound
    """
    inbound = await crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return inbound


@router.get("/{id}/hosts", response_model=Page[InboundHostResponse])
async def get_inbound_hosts(id: int, db: DBDep):
    """
    Get hosts of a specific inbound
    """
    inbound = await crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return await paginate(
        db, sa.select(DBInboundHost).filter(DBInboundHost.inbound_id == id)
    )


@router.post("/{id}/hosts", response_model=InboundHostResponse)
async def create_host(id: int, host: InboundHost, db: DBDep):
    """
    Add a host to the inbound
    """
    inbound = await crud.get_inbound(db, id)
    if not inbound:
        raise HTTPException(status_code=404, detail="Inbound not found")

    return await crud.add_host(db, inbound, host)
