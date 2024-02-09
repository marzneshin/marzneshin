from collections import defaultdict
from typing import TYPE_CHECKING

from .base import MarzNodeBase
from app import marznode

if TYPE_CHECKING:
    from app.db import User as DBUser


"""def get_tls():
    with GetDB() as db:
        tls = get_tls_certificate(db)
        return {
            "key": tls.key,
            "certificate": tls.certificate
        }"""


async def add_user(user: "DBUser"):
    node_inbounds = defaultdict(list)
    for inb in user.inbounds:
        node_inbounds[inb.node_id].append(inb.tag)

    for node_id, tags in node_inbounds.items():
        await marznode.nodes[node_id].add_user(user=user, inbounds=tags)


async def remove_user(user: "DBUser"):
    nodes_set = set()

    for inb in user.inbounds:
        nodes_set.add(inb.node_id)
    print(nodes_set)
    for n in nodes_set:
        await marznode.nodes[n].remove_user(user)


async def update_user_inbounds(user: "DBUser", new_inbounds: set, old_inbounds: set) -> None:
    """
    updates user inbounds by finding out inbound additions and reductions
    it then calculates all inbound additions and reductions for each node separately,
    and then sends requests to affected nodes
    :param user: the user
    :param new_inbounds: a set of all the new inbounds
    :param old_inbounds: a set of all the old inbounds
    :return: nothing
    """
    inbound_additions = new_inbounds - old_inbounds
    inbound_reductions = old_inbounds - new_inbounds

    node_inbounds = defaultdict(lambda: tuple((list(), list())))

    for inbound_addition in inbound_additions:
        node_inbounds[inbound_addition[0]][0].append(inbound_addition[3])
    for inbound_reduction in inbound_reductions:
        node_inbounds[inbound_reduction[0]][1].append(inbound_reduction[3])

    for node, inbound_change in node_inbounds.items():
        await marznode.nodes[node].update_user_inbounds(user, inbound_change[0], inbound_change[1])


async def remove_node(node_id: int):
    if node_id in marznode.nodes:
        try:
            await marznode.nodes[node_id].stop()
        except Exception:
            pass
        finally:
            del marznode.nodes[node_id]


async def add_node(node_id: int, node: MarzNodeBase):
    await remove_node(node_id)
    marznode.nodes[node_id] = node


__all__ = [
    "add_user",
    "remove_user",
    "update_user_inbounds",
    "add_node",
    "remove_node"
]
