from collections import defaultdict
from typing import TYPE_CHECKING

from .base import MarzNodeBase
from app import marznode
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
        await marznode.nodes[node_id].update_user(user=user, inbounds=tags)


async def remove_node(node_id: int):
    if node_id in marznode.nodes:
        del marznode.nodes[node_id]


async def add_node(node_id: int, node: MarzNodeBase):
    await remove_node(node_id)
    marznode.nodes[node_id] = node


__all__ = [
    "update_user",
    "add_node",
    "remove_node"
]
