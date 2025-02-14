import json
import secrets
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from enum import Enum
from types import NoneType
from typing import List, Optional, Tuple, Union

from sqlalchemy import and_, update, select, func, cast, Date, or_
from sqlalchemy.orm import Session, joinedload

from app.db.models import (
    JWT,
    TLS,
    Admin,
    Node,
    NodeUserUsage,
    InboundHost,
    Service,
    Inbound,
    System,
    User,
    Backend,
    HostChain,
)
from app.models.admin import AdminCreate, AdminPartialModify
from app.models.node import (
    NodeCreate,
    NodeModify,
    NodeStatus,
)
from app.models.proxy import InboundHost as InboundHostModify
from app.models.service import Service as ServiceModify, ServiceCreate
from app.models.system import TrafficUsageSeries
from app.models.user import (
    UserCreate,
    UserDataUsageResetStrategy,
    UserModify,
    UserStatus,
    UserExpireStrategy,
    UserNodeUsageSeries,
    UserUsageSeriesResponse,
)


def add_default_hosts(db: Session, inbounds: List[Inbound]):
    hosts = [
        InboundHost(
            remark="🚀 Marz ({USERNAME}) [{PROTOCOL} - {TRANSPORT}]",
            address="{SERVER_IP}",
            inbound=i,
        )
        for i in inbounds
    ]
    db.add_all(hosts)
    db.commit()


def ensure_node_backends(db: Session, backends, node_id: int):
    old_backends = db.query(Backend).where(Backend.node_id == node_id)
    for backend in old_backends:
        db.delete(backend)
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
    db.flush()


def ensure_node_inbounds(db: Session, inbounds: List[Inbound], node_id: int):
    current_tags = [
        i[0]
        for i in db.execute(
            select(Inbound.tag).filter(Inbound.node_id == node_id)
        ).all()
    ]
    updated_tags = set(i.tag for i in list(inbounds))
    inbound_additions, tag_deletions = list(), set()
    for tag in current_tags:
        if tag not in updated_tags:
            tag_deletions.add(tag)
    removals = db.query(Inbound).where(
        and_(Inbound.node_id == node_id, Inbound.tag.in_(tag_deletions))
    )
    for i in removals:
        db.delete(i)

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
            db.execute(stmt)
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
    db.flush()
    for i in new_inbounds:
        db.refresh(i)
    add_default_hosts(db, new_inbounds)
    db.commit()


def get_node_users(
    db: Session,
    node_id: int,
):
    query = (
        db.query(User.id, User.username, User.key, Inbound)
        .distinct()
        .join(Inbound.services)
        .join(Service.users)
        .filter(Inbound.node_id == node_id)
        .filter(User.activated == True)
    )
    return query.all()


def get_user_hosts(db: Session, user_id: int):
    return (
        db.query(InboundHost)
        .distinct()
        .join(User.services)
        .join(Service.inbounds)
        .join(Inbound.hosts)
        .filter(User.id == user_id)
        .all()
    )


def get_inbounds_hosts(
    db: Session, inbound_ids: list[int]
) -> list[InboundHost]:
    return (
        db.query(InboundHost)
        .options(
            joinedload(InboundHost.chain).joinedload(HostChain.chained_host)
        )
        .filter(InboundHost.inbound_id.in_(inbound_ids))
        .filter(InboundHost.is_disabled == False)
        .all()
    )


def get_hosts_for_user(session, user_id):
    # Fetch the user object (assumes relationships are properly set up in the model)
    user = session.query(User).filter(User.id == user_id).one()

    # Query for hosts linked through user's services and inbounds
    result_query = session.query(InboundHost).filter(
        and_(
            # Exclude disabled hosts
            InboundHost.is_disabled.is_(False),
            or_(
                # Case 1: Host has an inbound linked to a service of the user
                InboundHost.inbound.has(
                    Inbound.services.any(
                        Service.id.in_([s.id for s in user.services])
                    )
                ),
                # Case 2: Host has no inbound
                and_(
                    InboundHost.inbound_id.is_(
                        None
                    ),  # Host does not have an inbound
                    or_(
                        # Host is directly related to a service of the user
                        InboundHost.services.any(
                            Service.id.in_([s.id for s in user.services])
                        ),
                        # Host is available to all
                        InboundHost.universal.is_(True),
                    ),
                ),
            ),
        )
    )

    return result_query.all()


def get_all_inbounds(db: Session):
    return db.query(Inbound).all()


def get_inbound(db: Session, inbound_id: int) -> Inbound | None:
    return db.query(Inbound).filter(Inbound.id == inbound_id).first()


def get_host(db: Session, host_id) -> InboundHost:
    return db.query(InboundHost).filter(InboundHost.id == host_id).first()


def add_host(db: Session, inbound: Inbound | None, host: InboundHostModify):
    host = InboundHost(
        remark=host.remark,
        address=host.address,
        host_network=host.network,
        host_protocol=host.protocol,
        uuid=host.uuid,
        password=host.password,
        port=host.port,
        path=host.path,
        sni=host.sni,
        host=host.host,
        security=host.security,
        alpn=host.alpn.value,
        fingerprint=host.fingerprint,
        fragment=host.fragment.model_dump() if host.fragment else None,
        udp_noises=(
            [noise.model_dump() for noise in host.noise]
            if host.noise
            else None
        ),
        header_type=host.header_type,
        reality_public_key=host.reality_public_key,
        reality_short_ids=host.reality_short_ids,
        flow=host.flow,
        shadowtls_version=host.shadowtls_version,
        shadowsocks_method=host.shadowsocks_method,
        splithttp_settings=(
            host.splithttp_settings.model_dump()
            if host.splithttp_settings
            else None
        ),
        early_data=host.early_data,
        http_headers=host.http_headers,
        mtu=host.mtu,
        dns_servers=host.dns_servers,
        allowed_ips=host.allowed_ips,
        mux_settings=(
            host.mux_settings.model_dump() if host.mux_settings else None
        ),
        allowinsecure=host.allowinsecure,
        weight=host.weight,
        universal=host.universal,
        services=(
            db.query(Service).filter(Service.id.in_(host.service_ids)).all()
        ),
        chain=[
            HostChain(chained_host_id=ch[0])
            for ch in db.query(InboundHost.id)
            .filter(InboundHost.id.in_(host.chain_ids))
            .all()
        ],
    )
    if inbound:
        inbound.hosts.append(host)
    else:
        db.add(host)
    db.commit()
    db.refresh(host)
    return host


def update_host(db: Session, db_host: InboundHost, host: InboundHostModify):
    db_host.remark = host.remark
    db_host.address = host.address
    db_host.uuid = host.uuid
    db_host.password = host.password
    db_host.host_network = host.network
    db_host.host_protocol = host.protocol
    db_host.port = host.port
    db_host.path = host.path
    db_host.sni = host.sni
    db_host.host = host.host
    db_host.security = host.security
    db_host.alpn = host.alpn.value
    db_host.fingerprint = host.fingerprint
    db_host.fragment = host.fragment.model_dump() if host.fragment else None
    db_host.mux_settings = (
        host.mux_settings.model_dump() if host.mux_settings else None
    )
    db_host.is_disabled = host.is_disabled
    db_host.allowinsecure = host.allowinsecure
    db_host.udp_noises = (
        [noise.model_dump() for noise in host.noise] if host.noise else None
    )
    db_host.header_type = host.header_type
    db_host.reality_public_key = host.reality_public_key
    db_host.reality_short_ids = host.reality_short_ids
    db_host.flow = host.flow
    db_host.shadowtls_version = host.shadowtls_version
    db_host.shadowsocks_method = host.shadowsocks_method
    db_host.splithttp_settings = (
        host.splithttp_settings.model_dump()
        if host.splithttp_settings
        else None
    )
    db_host.early_data = host.early_data

    chain_ids = [
        int(i[0])
        for i in db.query(InboundHost.id)
        .filter(InboundHost.id.in_(host.chain_ids))
        .all()
    ]
    chain_nodes = [
        HostChain(host_id=db_host.id, chained_host_id=chain_id)
        for chain_id in chain_ids
    ]
    db_host.chain = chain_nodes
    db_host.http_headers = host.http_headers
    db_host.mtu = host.mtu
    db_host.dns_servers = host.dns_servers
    db_host.allowed_ips = host.allowed_ips
    db_host.universal = host.universal
    db_host.services = (
        db.query(Service).filter(Service.id.in_(host.service_ids)).all()
    )
    db_host.weight = host.weight
    db.commit()
    db.refresh(db_host)
    return db_host


def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


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


def get_users(
    db: Session,
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
) -> Union[List[User], Tuple[List[User], int]]:
    query = db.query(User).filter(User.removed == False)

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

    return query.all()


def get_user_total_usage(
    db: Session, user: User, start: datetime, end: datetime, per_day=False
):
    usages = defaultdict(int)

    query = db.query(
        (
            cast(NodeUserUsage.created_at, Date).label("day")
            if per_day
            else NodeUserUsage.created_at
        ),
        func.sum(NodeUserUsage.used_traffic),
    ).filter(
        and_(
            NodeUserUsage.user_id == user.id,
            NodeUserUsage.created_at >= start,
            NodeUserUsage.created_at <= end,
        )
    )
    if per_day:
        query = query.group_by(cast(NodeUserUsage.created_at, Date))
    else:
        query = query.group_by(NodeUserUsage.created_at)

    for date, used_traffic in query:
        if per_day:
            timestamp = datetime(
                date.year, date.month, date.day, tzinfo=timezone.utc
            ).timestamp()
            usages[timestamp] += int(used_traffic)
        else:
            usages[date.replace(tzinfo=timezone.utc).timestamp()] += int(
                used_traffic
            )

    result = TrafficUsageSeries(usages=[])
    current = start.astimezone(timezone.utc).replace(
        minute=0, second=0, microsecond=0
    )
    if per_day:
        current = current.replace(hour=0)

    step = timedelta(days=1) if per_day else timedelta(hours=1)
    while current <= end.replace(tzinfo=timezone.utc):
        current_usage = usages.get(current.timestamp()) or 0
        result.usages.append((int(current.timestamp()), current_usage))
        result.total += current_usage
        current += step

    result.step = int(step.total_seconds())
    return result


def get_total_usages(
    db: Session, admin: Admin, start: datetime, end: datetime
) -> TrafficUsageSeries:
    usages = defaultdict(int)

    query = (
        db.query(
            NodeUserUsage.created_at, func.sum(NodeUserUsage.used_traffic)
        )
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

    for created_at, used_traffic in query.all():
        timestamp = created_at.replace(tzinfo=timezone.utc).timestamp()
        usages[timestamp] += int(used_traffic)

    result = TrafficUsageSeries(usages=[], total=0)
    current = start.astimezone(timezone.utc).replace(
        minute=0, second=0, microsecond=0
    )

    while current <= end.replace(tzinfo=timezone.utc):
        usage = usages.get(current.timestamp()) or 0
        result.usages.append((int(current.timestamp()), usage))
        result.total += usage
        current += timedelta(hours=1)

    return result


def get_user_usages(
    db: Session,
    db_user: User,
    start: datetime,
    end: datetime,
) -> UserUsageSeriesResponse:
    usages = defaultdict(dict)

    cond = and_(
        NodeUserUsage.user_id == db_user.id,
        NodeUserUsage.created_at >= start,
        NodeUserUsage.created_at <= end,
    )

    for v in db.query(NodeUserUsage).filter(cond):
        timestamp = v.created_at.replace(tzinfo=timezone.utc).timestamp()
        usages[v.node_id][timestamp] = v.used_traffic

    node_ids = list(usages.keys())
    nodes = db.query(Node).where(Node.id.in_(node_ids))
    node_id_names = {node.id: node.name for node in nodes}

    result = UserUsageSeriesResponse(
        username=db_user.username, node_usages=[], total=0
    )

    for node_id, rows in usages.items():
        node_usages = UserNodeUsageSeries(
            node_id=node_id, node_name=node_id_names[node_id], usages=[]
        )
        current = start.astimezone(timezone.utc).replace(
            minute=0, second=0, microsecond=0
        )

        while current <= end:
            usage = rows.get(current.timestamp()) or 0
            node_usages.usages.append((int(current.timestamp()), usage))
            current += timedelta(hours=1)
            result.total += usage
        result.node_usages.append(node_usages)

    return result


def get_users_count(
    db: Session,
    admin: Admin | None = None,
    enabled: bool | None = None,
    online: bool | None = None,
    expire_strategy: UserExpireStrategy | None = None,
    is_active: bool | None = None,
    expired: bool | None = None,
    data_limit_reached: bool | None = None,
):
    query = db.query(User.id).filter(User.removed == False)
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

    return query.count()


def create_user(
    db: Session,
    user: Union[UserCreate, List[UserCreate]],
    admin: Admin = None,
    allowed_services: list | None = None,
):
    users = [user] if not isinstance(user, list) else user

    created_users = []
    for user_data in users:

        service_ids = (
            [sid for sid in user_data.service_ids if sid in allowed_services]
            if allowed_services is not None
            else user_data.service_ids
        )

        services = db.query(Service).filter(Service.id.in_(service_ids)).all()

        dbuser = User(
            username=user_data.username,
            key=user_data.key,
            expire_strategy=user_data.expire_strategy,
            expire_date=user_data.expire_date,
            usage_duration=user_data.usage_duration,
            activation_deadline=user_data.activation_deadline,
            services=services,
            data_limit=user_data.data_limit or None,
            admin=admin,
            data_limit_reset_strategy=user_data.data_limit_reset_strategy,
            note=user_data.note,
        )

        db.add(dbuser)
        created_users.append(dbuser)

    db.commit()

    for user in created_users:
        db.refresh(user)

    return created_users if len(created_users) > 1 else created_users[0]


def remove_user(db: Session, dbuser: User):
    dbuser.username = None
    dbuser.removed = True
    dbuser.activated = False
    # db.query(User).filter_by(id=user_id).delete()
    db.commit()


def update_user(
    db: Session,
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
            db.query(Service).filter(Service.id.in_(service_ids)).all()
        )
    dbuser.edit_at = datetime.utcnow()

    db.commit()
    db.refresh(dbuser)
    return dbuser


def reset_user_data_usage(db: Session, dbuser: User):
    dbuser.traffic_reset_at = datetime.utcnow()

    dbuser.used_traffic = 0

    db.add(dbuser)

    db.commit()
    db.refresh(dbuser)
    return dbuser


def revoke_user_sub(db: Session, dbuser: User):
    dbuser.key = secrets.token_hex(16)
    dbuser.sub_revoked_at = datetime.utcnow()
    db.commit()
    db.refresh(dbuser)
    return dbuser


def update_user_sub(db: Session, dbuser: User, user_agent: str):
    dbuser.sub_updated_at = datetime.utcnow()
    dbuser.sub_last_user_agent = user_agent

    db.commit()
    db.refresh(dbuser)
    return dbuser


def reset_all_users_data_usage(db: Session, admin: Optional[Admin] = None):
    query = db.query(User)

    if admin:
        query = query.filter(User.admin == admin)

    for db_user in query.all():
        db_user.used_traffic = 0

    db.commit()


def update_user_status(db: Session, dbuser: User, status: UserStatus):
    dbuser.status = status
    db.commit()
    db.refresh(dbuser)
    return dbuser


def set_owner(db: Session, dbuser: User, admin: Admin):
    dbuser.admin = admin
    db.commit()
    db.refresh(dbuser)
    return dbuser


def get_system_usage(db: Session):
    return db.query(System).first()


def get_jwt_secret_key(db: Session):
    return db.query(JWT).first().secret_key


def get_tls_certificate(db: Session):
    return db.query(TLS).first()


def get_admin(db: Session, username: str) -> Admin | None:
    return db.query(Admin).filter(Admin.username == username).first()


def create_admin(db: Session, admin: AdminCreate):
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
    db.commit()
    db.refresh(dbadmin)
    return dbadmin


def update_admin(
    db: Session, dbadmin: Admin, modifications: AdminPartialModify
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
            db.query(Service)
            .filter(Service.id.in_(modifications.service_ids))
            .all()
        )
    db.commit()
    db.refresh(dbadmin)
    return dbadmin


def partial_update_admin(
    db: Session, dbadmin: Admin, modified_admin: AdminPartialModify
):
    if modified_admin.is_sudo is not None:
        dbadmin.is_sudo = modified_admin.is_sudo
    if (
        modified_admin.password is not None
        and dbadmin.hashed_password != modified_admin.hashed_password
    ):
        dbadmin.hashed_password = modified_admin.hashed_password
        dbadmin.password_reset_at = datetime.utcnow()

    db.commit()
    db.refresh(dbadmin)
    return dbadmin


def remove_admin(db: Session, dbadmin: Admin):
    db.delete(dbadmin)
    db.commit()
    return dbadmin


def get_admins(
    db: Session,
    offset: Optional[int] = None,
    limit: Optional[int] = None,
    username: Optional[str] = None,
):
    query = db.query(Admin)
    if username:
        query = query.filter(Admin.username.ilike(f"%{username}%"))
    if offset:
        query = query.offset(offset)
    if limit:
        query = query.limit(limit)
    return query.all()


def create_service(db: Session, service: ServiceCreate) -> Service:
    dbservice = Service(
        name=service.name,
        inbounds=db.query(Inbound)
        .filter(Inbound.id.in_(service.inbound_ids))
        .all(),
        users=[],
    )
    db.add(dbservice)
    db.commit()
    db.refresh(dbservice)
    return dbservice


def get_service(db: Session, service_id: id) -> Service:
    return db.query(Service).filter(Service.id == service_id).first()


def get_services(db: Session) -> List[Service]:
    return db.query(Service).all()


def update_service(
    db: Session, db_service: Service, modification: ServiceModify
):
    if modification.name is not None:
        db_service.name = modification.name

    if modification.inbound_ids is not None:
        db_service.inbounds = (
            db.query(Inbound)
            .filter(Inbound.id.in_(modification.inbound_ids))
            .all()
        )

    db.commit()
    db.refresh(db_service)
    return db_service


def remove_service(db: Session, db_service: Service):
    db.delete(db_service)
    db.commit()
    return db_service


def get_node(db: Session, name: str):
    return db.query(Node).filter(Node.name == name).first()


def get_node_by_id(db: Session, node_id: int):
    return db.query(Node).filter(Node.id == node_id).first()


def get_nodes(
    db: Session,
    status: Optional[Union[NodeStatus, list]] = None,
    enabled: bool = None,
):
    query = db.query(Node)

    if status:
        if isinstance(status, list):
            query = query.filter(Node.status.in_(status))
        else:
            query = query.filter(Node.status == status)

    if enabled:
        query = query.filter(Node.status != NodeStatus.disabled)

    return query.all()


def get_node_usage(
    db: Session, start: datetime, end: datetime, node: Node
) -> TrafficUsageSeries:
    usages = defaultdict(int)

    query = (
        db.query(
            NodeUserUsage.created_at, func.sum(NodeUserUsage.used_traffic)
        )
        .group_by(NodeUserUsage.created_at)
        .filter(
            and_(
                NodeUserUsage.node_id == node.id,
                NodeUserUsage.created_at >= start,
                NodeUserUsage.created_at <= end,
            )
        )
    )

    for created_at, used_traffic in query.all():
        usages[created_at.replace(tzinfo=timezone.utc).timestamp()] += int(
            used_traffic
        )

    result = TrafficUsageSeries(usages=[], total=0)
    current = start.astimezone(timezone.utc).replace(
        minute=0, second=0, microsecond=0
    )

    while current <= end.replace(tzinfo=timezone.utc):
        usage = usages.get(current.timestamp()) or 0
        result.usages.append((int(current.timestamp()), usage))
        result.total += usage
        current += timedelta(hours=1)

    return result


def create_node(db: Session, node: NodeCreate):
    dbnode = Node(
        name=node.name,
        address=node.address,
        port=node.port,
        connection_backend=node.connection_backend,
    )

    db.add(dbnode)
    db.commit()
    db.refresh(dbnode)
    return dbnode


def remove_node(db: Session, dbnode: Node):
    db.delete(dbnode)
    db.commit()
    return dbnode


def update_node(db: Session, dbnode: Node, modify: NodeModify):
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

    db.commit()
    db.refresh(dbnode)
    return dbnode


def update_node_status(
    db: Session,
    node_id: int,
    status: NodeStatus,
    message: str = None,
    version: str = None,
):
    db_node = db.query(Node).where(Node.id == node_id).first()
    db_node.status = status
    if message:
        db_node.message = message
    db_node.last_status_change = datetime.utcnow()
    db.commit()
