import logging
from datetime import datetime
from typing import List

import sqlalchemy
from fastapi import APIRouter, Depends
from fastapi import HTTPException, WebSocket

from app import marznode
from app.db import crud, get_tls_certificate
from app.dependencies import DBDep, SudoAdminDep, sudo_admin, EndDateDep, StartDateDep
from app.marznode import MarzNodeGRPCIO
from app.models.admin import Admin
from app.models.node import (NodeCreate, NodeModify, NodeResponse,
                             NodeSettings, NodeStatus, NodesUsageResponse)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/nodes", tags=['Node'], dependencies=[Depends(sudo_admin)])


@router.get("/settings", response_model=NodeSettings)
def get_node_settings(db: DBDep,
                      admin: SudoAdminDep):
    tls = crud.get_tls_certificate(db)

    return NodeSettings(
        certificate=tls.certificate
    )


@router.post("", response_model=NodeResponse)
async def add_node(new_node: NodeCreate,
                   db: DBDep,
                   admin: SudoAdminDep):
    try:
        db_node = crud.create_node(db, new_node)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Node \"{new_node.name}\" already exists")
    certificate = get_tls_certificate(db)

    node = MarzNodeGRPCIO(db_node.address, db_node.port,
                        ssl_key=certificate.key, ssl_cert=certificate.certificate)

    await marznode.operations.add_node(db_node.id, node)

    logger.info("New node `%s` added", db_node.name)
    return db_node


@router.get("/{node_id}", response_model=NodeResponse)
def get_node(node_id: int,
             db: DBDep,
             admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return db_node


@router.websocket("/{node_id}/logs", dependencies=None)
async def node_logs(node_id: int,
                    websocket: WebSocket,
                    db: DBDep):
    token = (
        websocket.query_params.get('token')
        or
        websocket.headers.get('Authorization', '').removeprefix("Bearer ")
    )
    admin = Admin.get_admin(token, db)
    if not admin:
        return await websocket.close(reason="Unauthorized", code=4401)

    if not admin.is_sudo:
        return await websocket.close(reason="You're not allowed", code=4403)

    if not marznode.nodes.get(node_id):
        return await websocket.close(reason="Node not found", code=4404)

    if not await xray.nodes[node_id].is_healthy():
        return await websocket.close(reason="Node is not connected", code=4400)

    interval = websocket.query_params.get('interval')
    if interval:
        try:
            interval = float(interval)
        except ValueError:
            return await websocket.close(reason="Invalid interval value", code=4400)
        if interval > 10:
            return await websocket.close(reason="Interval must be more than 0 and at most 10 seconds", code=4400)

    await websocket.accept()
    async for l in xray.nodes[node_id].get_logs():
        await websocket.send_text(l)


@router.get("", response_model=List[NodeResponse])
def get_nodes(db: DBDep,
              admin: SudoAdminDep):
    return crud.get_nodes(db)


@router.put("/{node_id}", response_model=NodeResponse)
async def modify_node(node_id: int,
                      modified_node: NodeModify,
                      db: DBDep,
                      admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    db_node = crud.update_node(db, db_node, modified_node)

    await marznode.operations.remove_node(db_node.id)
    if db_node.status != NodeStatus.disabled:
        certificate = get_tls_certificate(db)
        node = MarzNodeGRPCIO(db_node.address, db_node.port,
                            ssl_key=certificate.key, ssl_cert=certificate.certificate)
        await marznode.operations.add_node(db_node.id, node)

    logger.info("Node `%s` modified", db_node.name)
    return db_node


@router.post("/{node_id}/resync")
async def reconnect_node(node_id: int,
                         db: DBDep,
                         admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return {}


@router.delete("/{node_id}")
async def remove_node(node_id: int,
                      db: DBDep,
                      admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    crud.remove_node(db, db_node)
    await marznode.operations.remove_node(db_node.id)

    logger.info(f"Node `%s` deleted", db_node.name)
    return {}


@router.get("/usage", response_model=NodesUsageResponse)
def get_usage(db: DBDep,
              admin: SudoAdminDep,
              start_date: StartDateDep,
              end_date: EndDateDep):
    """
    Get nodes usage
    """
    usages = crud.get_nodes_usage(db, start_date, end_date)

    return {"usages": usages}
