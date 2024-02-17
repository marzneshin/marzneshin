import asyncio
from collections import defaultdict

from grpclib import GRPCError

from app import marznode
from app.db import GetDB, crud, get_tls_certificate
from app.marznode import MarzNodeGRPC
from app.models.node import NodeStatus
from app.models.proxy import InboundBase
from app.models.user import UserStatus


async def nodes_health_check():
    with GetDB() as db:
        pass
        """for node_id, node in marznode.nodes.items():
            db_node = crud.get_node_by_id(db, node_id)
            if await node.is_alive():
                crud.update_node_status(db, db_node, NodeStatus.healthy)
                if not node.synced:
                    await resync_node(db, node, node_id)
            else:
                crud.update_node_status(db, db_node, NodeStatus.unhealthy)"""


async def resync_node(db, node, node_id):
    try:
        inbounds = await node.fetch_inbounds()
        crud.assure_node_inbounds(db, inbounds, node_id)
    except:
        pass
    relations = crud.get_node_users(db, node_id, [UserStatus.active, UserStatus.on_hold])
    users = dict()
    for rel in relations:
        if not users.get(rel[0]):
            users[rel[0]] = dict(username=rel[1], id=rel[0], key=rel[2], inbounds=[])
        users[rel[0]]["inbounds"].append(rel[3].tag)
    await node.repopulate_users(list(users.values()))
    node.synced = True
    asyncio.create_task(node._stream_user_updates())


async def nodes_startup():
    with GetDB() as db:
        certificate = get_tls_certificate(db)
        db_nodes = crud.get_nodes(db=db, enabled=True)
        for db_node in db_nodes:
            node = MarzNodeGRPC(db_node.address, db_node.port,
                                ssl_key=certificate.key, ssl_cert=certificate.certificate)
            """if not await node.is_alive():
                node.synced = False
                await marznode.operations.add_node(db_node.id, node)
                continue"""
            await resync_node(db, node, db_node.id)
            await marznode.operations.add_node(db_node.id, node)
            # crud.update_node_status(db, db_node, NodeStatus.connecting)
