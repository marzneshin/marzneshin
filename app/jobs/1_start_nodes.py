from collections import defaultdict

from grpclib import GRPCError

from app import app, scheduler, marznode
from app.db import GetDB, crud, get_tls_certificate
from app.marznode import MarzNodeGRPC
from app.models.node import NodeStatus
from app.models.proxy import InboundBase
from app.models.user import UserStatus


async def nodes_health_check():
    for node_id, node in marznode.nodes.items():
        if await node.is_alive():
            # node is connected, up and running
            continue
        # node isn't responsive


@app.on_event("startup")
async def nodes_startup():
    with GetDB() as db:
        certificate = get_tls_certificate(db)
        db_nodes = crud.get_nodes(db=db, enabled=True)
        for db_node in db_nodes:
            try:
                node = MarzNodeGRPC(db_node.address, db_node.port,
                                    ssl_key=certificate.key, ssl_cert=certificate.certificate)
                inbounds = await node.fetch_inbounds()
                crud.assure_node_inbounds(db, inbounds, db_node.id)
                relations = crud.get_node_users(db, db_node.id, [UserStatus.active, UserStatus.on_hold])
                users = dict()
                for rel in relations:
                    if not users.get(rel[0]):
                        users[rel[0]] = dict(username=rel[1], id=rel[0], key=rel[2], inbounds=[])
                    users[rel[0]]["inbounds"].append(rel[3].tag)

                try:
                    await node.repopulate_users(list(users.values()))
                except GRPCError:
                    pass
                await marznode.operations.add_node(db_node.id, node)
            except:
                pass
            # crud.update_node_status(db, db_node, NodeStatus.connecting)

    scheduler.add_job(nodes_health_check, 'interval', seconds=600, coalesce=True, max_instances=1)
