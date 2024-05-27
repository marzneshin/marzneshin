import json
import logging
from typing import Annotated

import sqlalchemy
from fastapi import APIRouter, Body, Query
from fastapi import HTTPException, WebSocket
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page
from starlette.websockets import WebSocketDisconnect

from app import marznode
from app.db import crud, get_tls_certificate
from app.db.models import Node
from app.dependencies import DBDep, SudoAdminDep, EndDateDep, StartDateDep, get_admin
from app.models.node import (
    NodeCreate,
    NodeModify,
    NodeResponse,
    NodeSettings,
    NodeStatus,
    NodesUsageResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/nodes", tags=["Node"])


@router.get("", response_model=Page[NodeResponse])
def get_nodes(
    db: DBDep,
    admin: SudoAdminDep,
    status: list[NodeStatus] = Query(None),
    name: str = Query(None),
):
    query = db.query(Node)

    if name:
        query = query.filter(Node.name.ilike(f"%{name}%"))

    if status:
        query = query.filter(Node.status.in_(status))

    return paginate(db, query)


@router.post("", response_model=NodeResponse)
async def add_node(new_node: NodeCreate, db: DBDep, admin: SudoAdminDep):
    try:
        db_node = crud.create_node(db, new_node)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409, detail=f'Node "{new_node.name}" already exists'
        )
    certificate = get_tls_certificate(db)

    await marznode.operations.add_node(db_node, certificate)

    logger.info("New node `%s` added", db_node.name)
    return db_node


@router.get("/settings", response_model=NodeSettings)
def get_node_settings(db: DBDep, admin: SudoAdminDep):
    tls = crud.get_tls_certificate(db)

    return NodeSettings(certificate=tls.certificate)


@router.get("/usage", response_model=NodesUsageResponse)
def get_usage(
    db: DBDep, admin: SudoAdminDep, start_date: StartDateDep, end_date: EndDateDep
):
    """
    Get nodes usage
    """
    usages = crud.get_nodes_usage(db, start_date, end_date)

    return {"usages": usages}


@router.get("/{node_id}", response_model=NodeResponse)
def get_node(node_id: int, db: DBDep, admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return db_node


@router.websocket("/{node_id}/logs")
async def node_logs(
    node_id: int, websocket: WebSocket, db: DBDep, include_buffer: bool = True
):
    token = websocket.query_params.get("token") or websocket.headers.get(
        "Authorization", ""
    ).removeprefix("Bearer ")
    admin = get_admin(db, token)

    if not admin or not admin.is_sudo:
        return await websocket.close(reason="You're not allowed", code=4403)

    if not marznode.nodes.get(node_id):
        return await websocket.close(reason="Node not found", code=4404)

    # if not await marznode.nodes[node_id].is_healthy:
    #    return await websocket.close(reason="Node is not connected", code=4400)

    await websocket.accept()
    try:
        async for line in marznode.nodes[node_id].get_logs(
            include_buffer=include_buffer
        ):
            try:
                await websocket.send_text(line)
            except WebSocketDisconnect:
                break
    except:
        await websocket.close()


@router.put("/{node_id}", response_model=NodeResponse)
async def modify_node(
    node_id: int, modified_node: NodeModify, db: DBDep, admin: SudoAdminDep
):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    db_node = crud.update_node(db, db_node, modified_node)

    await marznode.operations.remove_node(db_node.id)
    if db_node.status != NodeStatus.disabled:
        certificate = get_tls_certificate(db)
        await marznode.operations.add_node(db_node, certificate)

    logger.info("Node `%s` modified", db_node.name)
    return db_node


@router.delete("/{node_id}")
async def remove_node(node_id: int, db: DBDep, admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    crud.remove_node(db, db_node)
    await marznode.operations.remove_node(db_node.id)

    logger.info(f"Node `%s` deleted", db_node.name)
    return {}


@router.post("/{node_id}/resync")
async def reconnect_node(node_id: int, db: DBDep, admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return {}


@router.get("/{node_id}/xray_config")
async def get_node_xray_config(node_id: int, db: DBDep, admin: SudoAdminDep):
    if not (node := marznode.nodes.get(node_id)):
        raise HTTPException(status_code=404, detail="Node not found")

    try:
        config = await node.get_xray_config()
    except:
        raise HTTPException(status_code=502, detail="Node isn't responsive")
    else:
        return json.loads(config)


@router.put("/{node_id}/xray_config")
async def alter_node_xray_config(
    node_id: int, db: DBDep, admin: SudoAdminDep, body: Annotated[dict, Body()]
):
    if not (node := marznode.nodes.get(node_id)):
        raise HTTPException(status_code=404, detail="Node not found")
    xray_config = json.dumps(body)
    try:
        await node.restart_xray(xray_config)
    except:
        raise HTTPException(status_code=502, detail="Node isn't responsive")
    return {}
