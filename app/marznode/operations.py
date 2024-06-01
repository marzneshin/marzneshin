import asyncio
from collections import defaultdict
from typing import TYPE_CHECKING

from app import marznode
from .grpcio import MarzNodeGRPCIO
from .grpclib import MarzNodeGRPCLIB
from ..models.node import NodeConnectionBackend
from ..models.user import UserStatus

if TYPE_CHECKING:
    from app.db import User as DBUser


async def update_user(user: "DBUser", old_inbounds: set | None = None):
    """updates a user on all nodes
    even though this isn't efficient it is extremely precise"""
    if old_inbounds is None:
        old_inbounds = set()

    node_inbounds = defaultdict(list)
    if user.status in (UserStatus.on_hold, UserStatus.active):
        for inb in user.inbounds:
            node_inbounds[inb.node_id].append(inb.tag)
    else:
        for inb in user.inbounds:
            node_inbounds[inb.node_id]

    for inb in old_inbounds:
        node_inbounds[inb[0]]

    for node_id, tags in node_inbounds.items():
        if marznode.nodes.get(node_id):
            asyncio.create_task(
                marznode.nodes[node_id].update_user(user=user, inbounds=tags)
            )


async def remove_user(user: "DBUser"):
    node_ids = set(inb.node_id for inb in user.inbounds)

    for node_id in node_ids:
        if marznode.nodes.get(node_id):
            await marznode.nodes[node_id].update_user(user=user, inbounds=[])


async def remove_node(node_id: int):
    if node_id in marznode.nodes:
        del marznode.nodes[node_id]


async def add_node(db_node, certificate):
    await remove_node(db_node.id)
    if db_node.connection_backend == NodeConnectionBackend.grpcio:
        node = MarzNodeGRPCIO(db_node.id, db_node.address, db_node.port)
    else:
        node = MarzNodeGRPCLIB(
            db_node.id,
            db_node.address,
            db_node.port,
            certificate.key,
            certificate.certificate,
        )
    marznode.nodes[db_node.id] = node


__all__ = ["update_user", "add_node", "remove_node"]
