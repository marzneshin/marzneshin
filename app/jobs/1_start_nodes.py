import json

from app import app, logger, scheduler, xray
from app.db import GetDB, crud
from app.models.node import NodeStatus
from xray_api import exc as xray_exc


async def nodes_health_check():
    for node_id, node in list(xray.nodes.items()):
        if node.started and await node.is_healthy():
            try:
                await node.api.get_sys_stats()
            except (ConnectionError, xray_exc.ConnectionError, xray_exc.UnknownError):
                await xray.operations.restart_node(node_id, xray.configs[node_id].include_db_users(node_id))

        if not await node.is_healthy():
            await xray.operations.start_node(node_id, xray.configs[node_id].include_db_users(node_id))


@app.on_event("startup")
async def app_startup():
    with GetDB() as db:
        dbnodes = crud.get_nodes(db=db, enabled=True)
        node_ids = [dbnode.id for dbnode in dbnodes]
        for dbnode in dbnodes:
            crud.update_node_status(db, dbnode, NodeStatus.connecting)

    for node_id in node_ids:
        await xray.operations.start_node(node_id, xray.configs[node_id].include_db_users(node_id))

    scheduler.add_job(nodes_health_check, 'interval', seconds=20, coalesce=True, max_instances=1)


@app.on_event("shutdown")
async def app_shutdown():
    for node in list(xray.nodes.values()):
        try:
            await node.stop()
        except Exception:
            pass
