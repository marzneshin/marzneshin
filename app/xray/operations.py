from functools import lru_cache
from typing import TYPE_CHECKING
import traceback

from sqlalchemy.exc import SQLAlchemyError

from app import logger, xray
from app.db import GetDB, crud
from app.models.node import NodeStatus
from app.models.user import UserResponse
from app.utils.keygen import generate_settings
from app.xray.node import XRayNode
from xray_api import XRay as XRayAPI
from xray_api.types.account import Account, XTLSFlows

if TYPE_CHECKING:
    from app.db import User as DBUser
    from app.db.models import Node as DBNode


@lru_cache(maxsize=None)
def get_tls():
    from app.db import GetDB, get_tls_certificate
    with GetDB() as db:
        tls = get_tls_certificate(db)
        return {
            "key": tls.key,
            "certificate": tls.certificate
        }


async def _add_user_to_inbound(api: XRayAPI, inbound_tag: str, account: Account):
    logger.debug(f"adding user {account.email} to inbound {inbound_tag}")
    try:
        await api.add_inbound_user(tag=inbound_tag, user=account)
    except (xray.exc.EmailExistsError, xray.exc.ConnectionError):
        pass


async def _remove_user_from_inbound(api: XRayAPI, inbound_tag: str, email: str):
    logger.debug(f"removing user {email} from inbound {inbound_tag}")
    try:
        await api.remove_inbound_user(tag=inbound_tag, email=email)
    except (xray.exc.EmailNotFoundError, xray.exc.ConnectionError):
        pass


async def _alter_inbound_user(api: XRayAPI, inbound_tag: str, account: Account):
    try:
        await api.remove_inbound_user(tag=inbound_tag, email=account.email)
    except (xray.exc.EmailNotFoundError, xray.exc.ConnectionError):
        pass
    try:
        await api.add_inbound_user(tag=inbound_tag, user=account)
    except (xray.exc.EmailExistsError, xray.exc.ConnectionError):
        pass


async def add_user(user: "DBUser"):
    email, key = f"{user.id}.{user.username}", user.key

    for inb in user.inbounds:
        proxy_type, tag = inb.protocol, inb.tag
        # for inbound_tag in inbound_tags:
        # inbound = xray.config.inbounds_by_tag.get(inbound_tag, {})

        proxy_settings = generate_settings(key, proxy_type)# user.proxies[proxy_type].dict(no_obj=True)

        account = proxy_type.account_model(email=email, **proxy_settings)

        # XTLS currently only supports transmission methods of TCP and mKCP TODO
        """
        if getattr(account, 'flow', None) and (
            inbound.get('network', 'tcp') not in ('tcp', 'kcp')
            or
            (
                inbound.get('network', 'tcp') in ('tcp', 'kcp')
                and
                inbound.get('tls') not in ('tls', 'reality')
            )
            or
            inbound.get('header_type') == 'http'
        ):
            account.flow = XTLSFlows.NONE
        """
        if inb.node_id == 0:
            await _add_user_to_inbound(xray.api, tag, account)  # main core
        else:
            node = xray.nodes[inb.node_id]
            if await node.is_healthy():
                await _add_user_to_inbound(node.api, tag, account)
        #for node in list(xray.nodes.values()):
        #    if await node.is_healthy():
        #        await _add_user_to_inbound(node.api, tag, account)


async def remove_user(dbuser: "DBUser"):
    email = f"{dbuser.id}.{dbuser.username}"

    for inb in dbuser.inbounds:
        if inb.node_id == 0:
            await _remove_user_from_inbound(xray.api, inb.tag, email)
        else:
            await _remove_user_from_inbound(xray.nodes[node_id].api, inb.tag, email)
        #for node in list(xray.nodes.values()):
        #    if await node.is_healthy():
        #        await _remove_user_from_inbound(node.api, inb.tag, email)
    """
    for inbound_tag in xray.config.inbounds_by_tag:
        await _remove_user_from_inbound(xray.api, inbound_tag, email)
        for node in list(xray.nodes.values()):
            if await node.is_healthy():
                await _remove_user_from_inbound(node.api, inbound_tag, email)
    """

async def update_user(user: "DBUser", new_inbounds: set, old_inbounds: set):
    # user = UserResponse.model_validate(dbuser)
    email = f"{user.id}.{user.username}"
    key = user.key
    activated_inbounds = new_inbounds - old_inbounds
    disabled_inbounds = old_inbounds - new_inbounds
    
    for node_id, protocol, tag in activated_inbounds:
        account = protocol.account_model(email=email, **generate_settings(key, protocol))
        if node_id == 0:
            await _add_user_to_inbound(xray.api, tag, account)
        else:
            node = xray.nodes[node_id]
            if await node.is_healthy():
                await _add_user_to_inbound(node.api, tag, account)

    for node_id, protocol, tag in disabled_inbounds:
        if node_id == 0:
            await _remove_user_from_inbound(xray.api, tag, email)
        else:
            node = xray.nodes[node_id]
            if await node.is_healthy():
                await _remove_user_from_inbound(node.api, tag, email)
    """
    active_inbounds = []
    for proxy_type, inbound_tags in user.inbounds.items():
        for inbound_tag in inbound_tags:
            active_inbounds.append(inbound_tag)
            inbound = xray.config.inbounds_by_tag.get(inbound_tag, {})

            try:
                proxy_settings = user.proxies[proxy_type].dict(no_obj=True)
            except KeyError:
                pass
            account = proxy_type.account_model(email=email, **proxy_settings)

            # XTLS currently only supports transmission methods of TCP and mKCP
            if getattr(account, 'flow', None) and (
                inbound.get('network', 'tcp') not in ('tcp', 'kcp')
                or
                (
                    inbound.get('network', 'tcp') in ('tcp', 'kcp')
                    and
                    inbound.get('tls') not in ('tls', 'reality')
                )
                or
                inbound.get('header_type') == 'http'
            ):
                account.flow = XTLSFlows.NONE

            await _alter_inbound_user(xray.api, inbound_tag, account)  # main core
            for node in list(xray.nodes.values()):
                if await node.is_healthy():
                    await _alter_inbound_user(node.api, inbound_tag, account)

    for inbound_tag in xray.config.inbounds_by_tag:
        if inbound_tag in active_inbounds:
            continue
        # remove disabled inbounds
        await _remove_user_from_inbound(xray.api, inbound_tag, email)
        for node in list(xray.nodes.values()):
            if await node.is_healthy():
                await _remove_user_from_inbound(node.api, inbound_tag, email)"""


async def remove_node(node_id: int):
    if node_id in xray.nodes:
        try:
            await xray.nodes[node_id].stop()
        except Exception:
            pass
        finally:
            del xray.nodes[node_id]


async def add_node(dbnode: "DBNode"):
    await remove_node(dbnode.id)

    tls = get_tls()
    xray.nodes[dbnode.id] = XRayNode(address=dbnode.address,
                                     port=dbnode.port,
                                     api_port=dbnode.api_port,
                                     ssl_key=tls['key'],
                                     ssl_cert=tls['certificate'],
                                     usage_coefficient=dbnode.usage_coefficient)

    return xray.nodes[dbnode.id]


def _change_node_status(node_id: int, status: NodeStatus, message: str = None, version: str = None):
    with GetDB() as db:
        try:
            dbnode = crud.get_node_by_id(db, node_id)
            if not dbnode:
                return
            crud.update_node_status(db, dbnode, status, message, version)
        except SQLAlchemyError:
            db.rollback()


# @threaded_function
async def start_node(node_id, config):
    with GetDB() as db:
        dbnode = crud.get_node_by_id(db, node_id)

    if not dbnode:
        return

    try:
        node = xray.nodes[dbnode.id]
        assert await node.is_healthy()
    except (KeyError, AssertionError):
        node = await xray.operations.add_node(dbnode)

    try:
        _change_node_status(node_id, NodeStatus.connecting)
        logger.info(f"Starting \"{dbnode.name}\" node")
        await node.start(config)
        version = await node.fetch_xray_version()
        _change_node_status(node_id, NodeStatus.connected, version=version)
        logger.info(f"Started \"{dbnode.name}\" node, xray run on v{version}")
    except Exception as e:
        _change_node_status(node_id, NodeStatus.error, message=str(e))
        logger.info(f"Unable to Start \"{dbnode.name}\" node")


# @threaded_function
async def restart_node(node_id, config):
    with GetDB() as db:
        dbnode = crud.get_node_by_id(db, node_id)

    if not dbnode:
        return

    try:
        node = xray.nodes[dbnode.id]
    except KeyError:
        node = xray.operations.add_node(dbnode)

    if not await node.is_healthy():
        return await start_node(node_id, config)

    if not node.started:
        try:
            logger.info(f"Starting Xray core of \"{dbnode.name}\" node")
            await node.start(config)
            logger.info(f"Xray core of \"{dbnode.name}\" node started")
        except Exception as e:
            _change_node_status(node_id, NodeStatus.error, message=str(e))
            logger.info(f"Unable to start node {node_id}")
            try:
                node.disconnect()
            except Exception:
                pass
        return

    try:
        logger.info(f"Restarting Xray core of \"{dbnode.name}\" node")
        await node.restart(config)
        logger.info(f"Xray core of \"{dbnode.name}\" node restarted")
    except Exception as e:
        _change_node_status(node_id, NodeStatus.error, message=str(e))
        logger.info(f"Unable to restart node {node_id}")
        try:
            node.disconnect()
        except Exception:
            pass


__all__ = [
    "add_user",
    "remove_user",
    "add_node",
    "remove_node",
    "connect_node",
    "restart_node",
]
