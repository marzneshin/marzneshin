import asyncio
# import time
from datetime import datetime
from typing import List

import sqlalchemy
from fastapi import HTTPException, WebSocket


from app import app, logger, marznode
from app.db import crud, get_tls_certificate
from app.marznode import MarzNodeGRPC
from app.models.admin import Admin
from app.models.node import (NodeCreate, NodeModify, NodeResponse,
                             NodeSettings, NodeStatus, NodesUsageResponse)
from app.dependencies import DBDep, SudoAdminDep


@app.get("/api/node/settings", tags=['Node'], response_model=NodeSettings)
def get_node_settings(db: DBDep,
                      admin: SudoAdminDep):
    tls = crud.get_tls_certificate(db)

    return NodeSettings(
        certificate=tls.certificate
    )


@app.post("/api/node", tags=['Node'], response_model=NodeResponse)
async def add_node(new_node: NodeCreate,
                   db: DBDep,
                   admin: SudoAdminDep):
    try:
        db_node = crud.create_node(db, new_node)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail=f"Node \"{new_node.name}\" already exists")
    certificate = get_tls_certificate(db)

    node = MarzNodeGRPC(db_node.address, db_node.port,
                        ssl_key=certificate.key, ssl_cert=certificate.certificate)

    await marznode.operations.add_node(db_node.id, node)

    logger.info(f"New node \"{db_node.name}\" added")
    return db_node


@app.get("/api/node/{node_id}", tags=['Node'], response_model=NodeResponse)
def get_node(node_id: int,
             db: DBDep,
             admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return db_node


@app.websocket("/api/node/{node_id}/logs")
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


@app.get("/api/nodes", tags=['Node'], response_model=List[NodeResponse])
def get_nodes(db: DBDep,
              admin: SudoAdminDep):
    return crud.get_nodes(db)


@app.put("/api/node/{node_id}", tags=['Node'], response_model=NodeResponse)
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
        node = MarzNodeGRPC(db_node.address, db_node.port,
                            ssl_key=certificate.key, ssl_cert=certificate.certificate)
        await marznode.operations.add_node(db_node.id, node)

    logger.info(f"Node \"{db_node.name}\" modified")
    return db_node


@app.post("/api/node/{node_id}/resync", tags=['Node'])
async def reconnect_node(node_id: int,
                         db: DBDep,
                         admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    return {}


@app.delete("/api/node/{node_id}", tags=['Node'])
async def remove_node(node_id: int,
                      db: DBDep,
                      admin: SudoAdminDep):
    db_node = crud.get_node_by_id(db, node_id)
    if not db_node:
        raise HTTPException(status_code=404, detail="Node not found")

    crud.remove_node(db, db_node)
    await marznode.operations.remove_node(db_node.id)

    logger.info(f"Node \"{db_node.name}\" deleted")
    return {}


@app.get("/api/nodes/usage", tags=['Node'], response_model=NodesUsageResponse)
def get_usage(db: DBDep,
              admin: SudoAdminDep,
              start: str = None,
              end: str = None):
    """
    Get nodes usage
    """
    if start is None:
        start_date = datetime.fromtimestamp(datetime.utcnow().timestamp() - 30 * 24 * 3600)
    else:
        start_date = datetime.fromisoformat(start)

    if end is None:
        end_date = datetime.utcnow()
    else:
        end_date = datetime.fromisoformat(end)

    usages = crud.get_nodes_usage(db, start_date, end_date)

    return {"usages": usages}
