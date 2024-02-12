import asyncio
from collections import defaultdict
from datetime import datetime

from grpclib import GRPCError
from sqlalchemy import and_, select, insert, update, bindparam

from app import marznode, scheduler
from app.db import GetDB
from app.db.models import NodeUsage, NodeUserUsage, User
from app.marznode import MarzNodeBase


def record_user_stats(params: list, node_id: int,
                      consumption_factor: int = 1):
    if not params:
        return

    created_at = datetime.fromisoformat(datetime.utcnow().strftime('%Y-%m-%dT%H:00:00'))

    with GetDB() as db:
        # make user usage row if doesn't exist
        select_stmt = select(NodeUserUsage.user_id) \
            .where(and_(NodeUserUsage.node_id == node_id, NodeUserUsage.created_at == created_at))
        existings = [r[0] for r in db.execute(select_stmt).fetchall()]
        uids_to_insert = set()

        for p in params:
            uid = p['uid']
            if uid in existings:
                continue
            uids_to_insert.add(uid)

        if uids_to_insert:
            stmt = insert(NodeUserUsage).values(
                user_id=bindparam('uid'),
                created_at=created_at,
                node_id=node_id,
                used_traffic=0
            )
            db.execute(stmt, [{'uid': uid} for uid in uids_to_insert])

        # record
        stmt = update(NodeUserUsage) \
            .values(used_traffic=NodeUserUsage.used_traffic + bindparam('value') * consumption_factor) \
            .where(and_(NodeUserUsage.user_id == bindparam('uid'),
                        NodeUserUsage.node_id == node_id,
                        NodeUserUsage.created_at == created_at))
        db.connection().execute(stmt, params, execution_options={"synchronize_session": None})
        db.commit()


def record_node_stats(params: dict, node_id: int):
    if not params:
        return

    created_at = datetime.fromisoformat(datetime.utcnow().strftime('%Y-%m-%dT%H:00:00'))

    with GetDB() as db:

        # make node usage row if doesn't exist
        select_stmt = select(NodeUsage.node_id). \
            where(and_(NodeUsage.node_id == node_id, NodeUsage.created_at == created_at))
        notfound = db.execute(select_stmt).first() is None
        if notfound:
            stmt = insert(NodeUsage).values(created_at=created_at, node_id=node_id, uplink=0, downlink=0)
            db.execute(stmt)
            db.commit()

        # record
        stmt = update(NodeUsage). \
            values(uplink=NodeUsage.uplink + bindparam('up'), downlink=NodeUsage.downlink + bindparam('down')). \
            where(and_(NodeUsage.node_id == node_id, NodeUsage.created_at == created_at))

        db.execute(stmt, params)


async def get_users_stats(node_id: int, node: MarzNodeBase) -> tuple[int, list[dict]]:
    try:
        params = list()
        for stat in await node.fetch_users_stats():
            if stat.usage:
                params.append({"uid": stat.uid, "value": stat.usage})
        return node_id, params
    except (GRPCError, ConnectionError, OSError):
        return node_id, []


async def record_user_usages():
    # usage_coefficient = {None: 1}  # default usage coefficient for the main api instance

    results = await asyncio.gather(
             *[get_users_stats(node_id, node) for node_id, node in marznode.nodes.items()]
             )
    api_params = {node_id: params for node_id, params in list(results)}

    users_usage = defaultdict(int)
    for node_id, params in api_params.items():
        coefficient = node.usage_coefficient if (node := marznode.nodes.get(node_id)) else 1
        for param in params:
            users_usage[param['uid']] += param['value'] * coefficient  # apply the usage coefficient

    users_usage = list({"id": uid, "value": value} for uid, value in users_usage.items())
    if not users_usage:
        return

    # record users usage
    with GetDB() as db:
        stmt = update(User)\
            .values(
            used_traffic=User.used_traffic + bindparam('value'),
            online_at=datetime.utcnow()
        )

        db.execute(stmt, users_usage, execution_options={"synchronize_session": None})
        db.commit()

    for node_id, params in api_params.items():
        record_user_stats(params, node_id,
                          node.usage_coefficient if (node := marznode.nodes.get(node_id)) else 1)

scheduler.add_job(record_user_usages, 'interval', coalesce=True, seconds=30)
