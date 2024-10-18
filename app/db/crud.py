import json
import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from enum import Enum
from types import NoneType
from typing import List, Optional, Sequence, Tuple, Union

from sqlalchemy import and_, delete, update, select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import (
    JWT,
    TLS,
    Admin,
    Node,
    NodeUsage,
    NodeUserUsage,
    NotificationReminder,
    InboundHost,
    Service,
    Inbound,
    System,
    User,
    Backend,
)
from app.models.admin import AdminCreate, AdminPartialModify
from app.models.node import (
    NodeCreate,
    NodeModify,
    NodeStatus,
    NodeUsageResponse,
)
from app.models.proxy import InboundHost as InboundHostModify
from app.models.service import Service as ServiceModify, ServiceCreate
from app.models.system import TrafficUsageSeries
from app.models.user import (
    ReminderType,
    UserCreate,
    UserDataUsageResetStrategy,
    UserModify,
    UserStatus,
    UserExpireStrategy,
    UserNodeUsageSeries,
    UserUsageSeriesResponse,
)


async def add_default_hosts(db: AsyncSession, inbounds: List[Inbound]):
    hosts = [
        InboundHost(
            remark="🚀 Marz ({USERNAME}) [{PROTOCOL} - {TRANSPORT}]",
            address="{SERVER_IP}",
            inbound=i,
        )
        for i in inbounds
    ]
    db.add_all(hosts)
    await db.commit()


async def ensure_node_backends(db: AsyncSession, backends, node_id: int):
    await db.execute(delete(Backend).where(Backend.node_id == node_id))
    backends = [
        Backend(
            name=backend.name,
            backend_type=backend.type,
            version=backend.version,
            node_id=node_id,
        )
        for backend in backends
    ]
    db.add_all(backends)
    await db.commit()


async def ensure_node_inbounds(
    db: AsyncSession, inbounds: List[Inbound], node_id: int
):
    current_tags = (
        await db.scalars(
            select(Inbound.tag).filter(Inbound.node_id == node_id)
        )
    ).all()
    updated_tags = set(i.tag for i in list(inbounds))
    inbound_additions, tag_deletions = list(), set()
    for tag in current_tags:
        if tag not in updated_tags:
            tag_deletions.add(tag)
    removals = delete(Inbound).where(
        and_(Inbound.node_id == node_id, Inbound.tag.in_(tag_deletions))
    )
    await db.execute(removals)

    for inb in inbounds:
        if inb.tag in current_tags:
            stmt = (
                update(Inbound)
                .where(
                    and_(Inbound.node_id == node_id, Inbound.tag == inb.tag)
                )
                .values(
                    protocol=json.loads(inb.config)["protocol"],
                    config=inb.config,
                )
            )
            await db.execute(stmt)
        else:
            inbound_additions.append(inb)
    new_inbounds = [
        Inbound(
            tag=inb.tag,
            protocol=json.loads(inb.config)["protocol"],
            config=inb.config,
            node_id=node_id,
        )
        for inb in inbound_additions
    ]
    db.add_all(new_inbounds)
    await db.flush()
    for i in new_inbounds:
        await db.refresh(i)
    await add_default_hosts(db, new_inbounds)
    await db.commit()


async def get_node_users(
    db: AsyncSession,
    node_id: int,
):
    query = (
        select(User.id, User.username, User.key, Inbound)
        .distinct()
        .join(Inbound.services)
        .join(Service.users)
        .filter(Inbound.node_id == node_id)
        .filter(User.activated == True)
    )
    result = await db.execute(query)
    return result.all()


async def get_user_hosts(db: AsyncSession, user_id: int):
    query = (
        select(InboundHost)
        .distinct()
        .join(User.services)
        .join(Service.inbounds)
        .join(Inbound.hosts)
        .filter(User.id == user_id)
    )
    return (await db.scalars(query)).all()


async def get_inbound_hosts(
    db: AsyncSession, inbound_id: int
) -> Sequence[InboundHost]:
    return (
        await db.scalars(
            select(InboundHost).filter(InboundHost.inbound_id == inbound_id)
        )
    ).all()


async def get_all_inbounds(db: AsyncSession):
    return (await db.scalars(select(Inbound))).all()


async def get_inbound(db: AsyncSession, inbound_id: int) -> Inbound | None:
    return await db.get(entity=Inbound, ident=inbound_id)


async def get_host(db: AsyncSession, host_id) -> InboundHost | None:
    return await db.scalar(
        select(InboundHost).filter(InboundHost.id == host_id)
    )


async def add_host(
    db: AsyncSession, inbound: Inbound, host: InboundHostModify
):
    host = InboundHost(
        remark=host.remark,
        address=host.address,
        port=host.port,
        path=host.path,
        sni=host.sni,
        host=host.host,
        inbound=inbound,
        security=host.security,
        alpn=host.alpn.value,
        fingerprint=host.fingerprint,
        fragment=host.fragment.model_dump() if host.fragment else None,
        mux=host.mux,
        allowinsecure=host.allowinsecure,
        weight=host.weight,
    )
    inbound.hosts.append(host)
    await db.commit()
    await db.refresh(host)
    return host


async def update_host(
    db: AsyncSession, db_host: InboundHost, host: InboundHostModify
):
    db_host.remark = host.remark
    db_host.address = host.address
    db_host.port = host.port
    db_host.path = host.path
    db_host.sni = host.sni
    db_host.host = host.host
    db_host.security = host.security
    db_host.alpn = host.alpn.value
    db_host.fingerprint = host.fingerprint
    db_host.fragment = host.fragment.model_dump() if host.fragment else None
    db_host.mux = host.mux
    db_host.is_disabled = host.is_disabled
    db_host.allowinsecure = host.allowinsecure
    db_host.weight = host.weight
    await db.commit()
    await db.refresh(db_host)
    return db_host


async def get_user(db: AsyncSession, username: str):
    return await db.scalar(select(User).filter(User.username == username))


async def get_user_by_id(db: AsyncSession, user_id: int):
    return await db.get(entity=User, ident=user_id)


UsersSortingOptions = Enum(
    "UsersSortingOptions",
    {
        "username": User.username.asc(),
        "used_traffic": User.used_traffic.asc(),
        "data_limit": User.data_limit.asc(),
        "expire": User.expire_date.asc(),
        "created_at": User.created_at.asc(),
        "-username": User.username.desc(),
        "-used_traffic": User.used_traffic.desc(),
        "-data_limit": User.data_limit.desc(),
        "-expire": User.expire_date.desc(),
        "-created_at": User.created_at.desc(),
    },
)


async def get_users(
    db: AsyncSession,
    offset: Optional[int] = None,
    limit: Optional[int] = None,
    usernames: Optional[List[str]] = None,
    sort: Optional[List[UsersSortingOptions]] = None,
    admin: Optional[Admin] = None,
    reset_strategy: Optional[Union[UserDataUsageResetStrategy, list]] = None,
    expire_strategy: (
        UserExpireStrategy | list[UserExpireStrategy] | None
    ) = None,
    is_active: bool | None = None,
    activated: bool | None = None,
    expired: bool | None = None,
    data_limit_reached: bool | None = None,
    enabled: bool | None = None,
) -> Union[Sequence[User], Tuple[Sequence[User], int]]:
    query = select(User).filter(User.removed == False)

    if usernames:
        if len(usernames) == 1:
            query = query.filter(User.username.ilike(f"%{usernames[0]}%"))
        else:
            query = query.filter(User.username.in_(usernames))

    if reset_strategy:
        if isinstance(reset_strategy, list):
            query = query.filter(
                User.data_limit_reset_strategy.in_(reset_strategy)
            )
        else:
            query = query.filter(
                User.data_limit_reset_strategy == reset_strategy
            )

    if expire_strategy:
        if isinstance(expire_strategy, list):
            query = query.filter(User.expire_strategy.in_(expire_strategy))
        else:
            query = query.filter(User.expire_strategy == expire_strategy)

    if isinstance(is_active, bool):
        query = query.filter(User.is_active == is_active)

    if isinstance(activated, bool):
        query = query.filter(User.activated == activated)

    if isinstance(expired, bool):
        query = query.filter(User.expired == expired)

    if isinstance(data_limit_reached, bool):
        query = query.filter(User.data_limit_reached == data_limit_reached)

    if isinstance(enabled, bool):
        query = query.filter(User.enabled == enabled)

    if admin:
        query = query.filter(User.admin == admin)

    if sort:
        query = query.order_by(*(opt.value for opt in sort))

    if offset:
        query = query.offset(offset)

    if limit:
        query = query.limit(limit)

    return (await db.scalars(query)).all()


async def get_total_usages(
    db: AsyncSession, admin: Admin, start: datetime, end: datetime
):
    usages = defaultdict(int)

    query = (
        select(NodeUserUsage.created_at, func.sum(NodeUserUsage.used_traffic))
        .group_by(NodeUserUsage.created_at)
        .filter(
            and_(
                NodeUserUsage.created_at >= start,
                NodeUserUsage.created_at <= end,
            )
        )
    )

    if not admin.is_sudo:
        query = (
            query.filter(
                Admin.id == admin.id,
            )
            .join(User, NodeUserUsage.user_id == User.id)
            .join(Admin, User.admin_id == Admin.id)
        )
    res = (await db.execute(query)).scalars().all()
    for created_at, used_traffic in res:
        usages[created_at.replace(tzinfo=timezone.utc).timestamp()] += int(
            used_traffic
        )

    result = TrafficUsageSeries(usages=[])
    current = start.astimezone(timezone.utc).replace(
        minute=0, second=0, microsecond=0
    )

    while current <= end.replace(tzinfo=timezone.utc):
        result.usages.append(
            (int(current.timestamp()), usages.get(current.timestamp()) or 0)
        )
        current += timedelta(hours=1)

    return result


async def get_user_usages(
    db: AsyncSession,
    db_user: User,
    start: datetime,
    end: datetime,
) -> UserUsageSeriesResponse:
    cond = and_(
        NodeUserUsage.user_id == db_user.id,
        NodeUserUsage.created_at >= start,
        NodeUserUsage.created_at <= end,
    )

    usages = defaultdict(dict)

    nodes_user_usage = await db.stream_scalars(
        select(NodeUserUsage).filter(cond)
    )
    for v in nodes_user_usage:
        usages[v.node_id][
            v.created_at.replace(tzinfo=timezone.utc).timestamp()
        ] = v.used_traffic

    node_ids = list(usages.keys())
    nodes = (await db.scalars(select(Node).where(Node.id.in_(node_ids)))).all()
    node_id_names = {node.id: node.name for node in nodes}

    result = UserUsageSeriesResponse(username=db_user.username, node_usages=[])
    for node_id, rows in usages.items():
        node_usages = UserNodeUsageSeries(
            node_id=node_id, node_name=node_id_names[node_id], usages=[]
        )
        current = start.astimezone(timezone.utc).replace(
            minute=0, second=0, microsecond=0
        )

        while current <= end:
            node_usages.usages.append(
                (int(current.timestamp()), rows.get(current.timestamp()) or 0)
            )
            current += timedelta(hours=1)
        result.node_usages.append(node_usages)

    return result


async def get_users_count(
    db: AsyncSession,
    admin: Admin | None = None,
    enabled: bool | None = None,
    online: bool | None = None,
    expire_strategy: UserExpireStrategy | None = None,
    is_active: bool | None = None,
    expired: bool | None = None,
    data_limit_reached: bool | None = None,
):
    query = select(func.count(User.id)).filter(User.removed == False)

    if admin:
        query = query.filter(User.admin_id == admin.id)
    if is_active:
        query = query.filter(User.is_active == is_active)
    if expired:
        query = query.filter(User.expired == expired)
    if data_limit_reached:
        query = query.filter(User.data_limit_reached == data_limit_reached)
    if enabled:
        query = query.filter(User.enabled == enabled)
    if online is True:
        query = query.filter(
            User.online_at > (datetime.utcnow() - timedelta(seconds=30))
        )
    elif online is False:
        query = query.filter(
            User.online_at < (datetime.utcnow() - timedelta(seconds=30))
        )
    if expire_strategy:
        query = query.filter(User.expire_strategy == expire_strategy)

    result = await db.scalar(query)
    return result


async def create_user(
    db: AsyncSession,
    user: UserCreate,
    admin_id: int,
    allowed_services: list | None = None,
):
    service_ids = (
        [sid for sid in user.service_ids if sid in allowed_services]
        if allowed_services is not None
        else user.service_ids
    )
    dbuser = User(
        username=user.username,
        key=user.key,
        expire_strategy=user.expire_strategy,
        expire_date=user.expire_date,
        usage_duration=user.usage_duration,
        activation_deadline=user.activation_deadline,
        services=(
            await db.scalars(
                select(Service).filter(Service.id.in_(service_ids))
            )
        ).all(),  # user.services,
        data_limit=(user.data_limit or None),
        admin_id=admin_id,
        data_limit_reset_strategy=user.data_limit_reset_strategy,
        note=user.note,
    )
    db.add(dbuser)
    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def remove_user(db: AsyncSession, dbuser: User):
    dbuser.removed = True
    dbuser.activated = False
    # db.query(User).filter_by(id=user_id).delete()
    await db.commit()


async def update_user(
    db: AsyncSession,
    dbuser: User,
    modify: UserModify,
    allowed_services: list | None = None,
):
    if modify.data_limit is not None:
        dbuser.data_limit = modify.data_limit or None

    if modify.expire_strategy is not None:
        dbuser.expire_strategy = modify.expire_strategy or None

        if modify.expire_strategy == UserExpireStrategy.FIXED_DATE:
            dbuser.usage_duration = None
            dbuser.activation_deadline = None
        elif modify.expire_strategy == UserExpireStrategy.START_ON_FIRST_USE:
            dbuser.expire_date = None
        elif modify.expire_strategy == UserExpireStrategy.NEVER:
            dbuser.expire_date = None
            dbuser.usage_duration = None
            dbuser.activation_deadline = None

    if modify.expire_date is not None:
        dbuser.expire_date = modify.expire_date or None

    if modify.note is not None:
        dbuser.note = modify.note or None

    if modify.data_limit_reset_strategy is not None:
        dbuser.data_limit_reset_strategy = modify.data_limit_reset_strategy

    if modify.activation_deadline is not None:
        dbuser.activation_deadline = modify.activation_deadline

    if modify.usage_duration is not None:
        dbuser.usage_duration = modify.usage_duration

    if modify.service_ids is not None:
        if allowed_services is not None:
            service_ids = [
                sid for sid in modify.service_ids if sid in allowed_services
            ]
        else:
            service_ids = modify.service_ids

        dbuser.services = (
            await db.scalars(
                select(Service).filter(Service.id.in_(service_ids))
            )
        ).all()
    dbuser.edit_at = datetime.utcnow()

    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def reset_user_data_usage(db: AsyncSession, dbuser: User):
    dbuser.traffic_reset_at = datetime.utcnow()

    dbuser.used_traffic = 0

    db.add(dbuser)

    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def revoke_user_sub(db: AsyncSession, dbuser: User):
    dbuser.key = secrets.token_hex(16)
    dbuser.sub_revoked_at = datetime.utcnow()
    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def update_user_sub(db: AsyncSession, dbuser: User, user_agent: str):
    dbuser.sub_updated_at = datetime.utcnow()
    dbuser.sub_last_user_agent = user_agent

    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def reset_all_users_data_usage(
    db: AsyncSession, admin: Optional[Admin] = None
):
    query = select(User)

    if admin:
        query = query.filter(User.admin == admin)

    users = await db.stream_scalars(query)

    async for db_user in users:
        db_user.used_traffic = 0

    await db.commit()


async def update_user_status(
    db: AsyncSession, dbuser: User, status: UserStatus
):
    dbuser.status = status
    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def set_owner(db: AsyncSession, dbuser: User, admin: Admin):
    dbuser.admin = admin
    await db.commit()
    await db.refresh(dbuser)
    return dbuser


async def get_system_usage(db: AsyncSession):
    return await db.scalar(select(System))


async def get_jwt_secret_key(db: AsyncSession):
    return await db.scalar(select(JWT.secret_key))


async def get_tls_certificate(db: AsyncSession):
    return await db.scalar(select(TLS))


async def get_admin(db: AsyncSession, username: str) -> Admin | None:
    return await db.scalar(select(Admin).filter(Admin.username == username))


async def create_admin(db: AsyncSession, admin: AdminCreate):
    dbadmin = Admin(
        username=admin.username,
        hashed_password=admin.hashed_password,
        is_sudo=admin.is_sudo,
        enabled=admin.enabled,
        all_services_access=admin.all_services_access,
        modify_users_access=admin.modify_users_access,
        services=db.query(Service)
        .filter(Service.id.in_(admin.service_ids))
        .all(),
        subscription_url_prefix=admin.subscription_url_prefix,
    )
    db.add(dbadmin)
    await db.commit()
    await db.refresh(dbadmin)
    return dbadmin


async def update_admin(
    db: AsyncSession, dbadmin: Admin, modifications: AdminPartialModify
):
    for attribute in [
        "is_sudo",
        "hashed_password",
        "enabled",
        "all_services_access",
        "modify_users_access",
        "subscription_url_prefix",
    ]:
        if not isinstance(getattr(modifications, attribute), NoneType):
            setattr(dbadmin, attribute, getattr(modifications, attribute))
            if attribute == "hashed_password":
                dbadmin.password_reset_at = datetime.utcnow()
    if isinstance(modifications.service_ids, list):
        dbadmin.services = (
            await db.scalars(
                select(Service).filter(
                    Service.id.in_(modifications.service_ids)
                )
            )
        ).all()
    await db.commit()
    await db.refresh(dbadmin)
    return dbadmin


async def partial_update_admin(
    db: AsyncSession, dbadmin: Admin, modified_admin: AdminPartialModify
):
    if modified_admin.is_sudo is not None:
        dbadmin.is_sudo = modified_admin.is_sudo
    if (
        modified_admin.password is not None
        and dbadmin.hashed_password != modified_admin.hashed_password
    ):
        dbadmin.hashed_password = modified_admin.hashed_password
        dbadmin.password_reset_at = datetime.utcnow()

    await db.commit()
    await db.refresh(dbadmin)
    return dbadmin


async def remove_admin(db: AsyncSession, dbadmin: Admin):
    await db.delete(dbadmin)
    await db.commit()
    return dbadmin


async def get_admins(
    db: AsyncSession,
    offset: Optional[int] = None,
    limit: Optional[int] = None,
    username: Optional[str] = None,
):
    query = select(Admin)
    if username:
        query = query.filter(Admin.username.ilike(f"%{username}%"))
    if offset:
        query = query.offset(offset)
    if limit:
        query = query.limit(limit)

    result = await db.scalars(query)
    return result.all()


async def create_service(db: AsyncSession, service: ServiceCreate) -> Service:
    inbounds = (
        await db.scalars(
            select(Inbound).filter(Inbound.id.in_(service.inbound_ids))
        )
    ).all()
    dbservice = Service(
        name=service.name,
        inbounds=inbounds,
        users=[],
    )
    db.add(dbservice)
    await db.commit()
    await db.refresh(dbservice)
    return dbservice


async def get_service(db: AsyncSession, service_id: id) -> Service:
    return await db.get(Service, service_id)


async def get_services(db: AsyncSession) -> Sequence[Service]:
    return (await db.scalars(select(Service))).all()


async def update_service(
    db: AsyncSession, db_service: Service, modification: ServiceModify
):
    if modification.name is not None:
        db_service.name = modification.name

    if modification.inbound_ids is not None:
        db_service.inbounds = (
            await db.scalars(
                select(Inbound).filter(
                    Inbound.id.in_(modification.inbound_ids)
                )
            )
        ).all()
    await db.commit()
    await db.refresh(db_service)
    return db_service


async def remove_service(db: AsyncSession, db_service: Service):
    await db.delete(db_service)
    await db.commit()
    return db_service


async def get_node(db: AsyncSession, name: str):
    return await db.scalar(select(Node).filter(Node.name == name))


async def get_node_by_id(db: AsyncSession, node_id: int):
    query = select(Node).where(Node.id == node_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()
    # return await db.get(Node, node_id)


async def get_nodes(
    db: AsyncSession,
    status: Optional[Union[NodeStatus, list]] = None,
    enabled: bool = None,
):
    query = select(Node)

    if status:
        if isinstance(status, list):
            query = query.filter(Node.status.in_(status))
        else:
            query = query.filter(Node.status == status)

    if enabled:
        query = query.filter(Node.status != NodeStatus.disabled)

    result = await db.scalars(query)
    return result.all()


async def get_nodes_usage(
    db: AsyncSession, start: datetime, end: datetime
) -> List[NodeUsageResponse]:
    usages = dict()

    nodes = await db.stream_scalars(select(Node))
    async for node in nodes:
        usages[node.id] = NodeUsageResponse(
            node_id=node.id, node_name=node.name, uplink=0, downlink=0
        )

    cond = and_(NodeUsage.created_at >= start, NodeUsage.created_at <= end)

    node_usage = await db.stream_scalars(select(NodeUsage).filter(cond))
    async for v in node_usage:
        try:
            usages[v.node_id or 0].uplink += v.uplink
            usages[v.node_id or 0].downlink += v.downlink
        except KeyError:
            pass

    return list(usages.values())


async def create_node(db: AsyncSession, node: NodeCreate):
    dbnode = Node(
        name=node.name,
        address=node.address,
        port=node.port,
        connection_backend=node.connection_backend,
    )

    db.add(dbnode)
    await db.commit()
    await db.refresh(dbnode)
    return dbnode


async def remove_node(db: AsyncSession, dbnode: Node):
    await db.delete(dbnode)
    await db.commit()
    return dbnode


async def update_node(db: AsyncSession, dbnode: Node, modify: NodeModify):
    if modify.name is not None:
        dbnode.name = modify.name

    if modify.address is not None:
        dbnode.address = modify.address

    if modify.port is not None:
        dbnode.port = modify.port

    if modify.status is NodeStatus.disabled:
        dbnode.status = modify.status
        dbnode.xray_version = None
        dbnode.message = None
    else:
        dbnode.status = NodeStatus.unhealthy

    if modify.usage_coefficient:
        dbnode.usage_coefficient = modify.usage_coefficient

    if modify.connection_backend:
        dbnode.connection_backend = modify.connection_backend

    await db.commit()
    await db.refresh(dbnode)
    return dbnode


async def update_node_status(
    db: AsyncSession,
    node_id: int,
    status: NodeStatus,
    message: str = None,
    version: str = None,
):
    db_node = await db.scalar((select(Node).where(Node.id == node_id)))
    db_node.status = status
    if message:
        db_node.message = message
    db_node.last_status_change = datetime.utcnow()
    await db.commit()


async def create_notification_reminder(
    db: AsyncSession,
    reminder_type: ReminderType,
    expires_at: datetime,
    user_id: int,
) -> NotificationReminder:
    reminder = NotificationReminder(
        type=reminder_type, expires_at=expires_at, user_id=user_id
    )
    db.add(reminder)
    await db.commit()
    await db.refresh(reminder)
    return reminder


async def get_notification_reminder(
    db: AsyncSession,
    user_id: int,
    reminder_type: ReminderType,
) -> Optional[NotificationReminder]:
    reminder = await db.scalar(
        select(NotificationReminder)
        .filter(NotificationReminder.user_id == user_id)
        .filter(NotificationReminder.type == reminder_type)
    )
    if reminder is None:
        return
    if reminder.expires_at and reminder.expires_at < datetime.utcnow():
        await db.delete(reminder)
        await db.commit()
        return
    return reminder


async def delete_notification_reminder_by_type(
    db: AsyncSession, user_id: int, reminder_type: ReminderType
) -> None:
    """Deletes notification reminder filtered by user_id and type if exists"""
    stmt = delete(NotificationReminder).where(
        NotificationReminder.user_id == user_id,
        NotificationReminder.type == reminder_type,
    )
    await db.execute(stmt)
    await db.commit()
    return


async def delete_notification_reminder(
    db: AsyncSession, dbreminder: NotificationReminder
) -> None:
    await db.delete(dbreminder)
    await db.commit()
    return
