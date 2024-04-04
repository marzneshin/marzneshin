import json
import secrets
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Optional, Tuple, Union

from sqlalchemy import and_, delete, update, select
from sqlalchemy.orm import Session

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
    UserUsageResetLogs,
)
from app.models.admin import AdminCreate, AdminModify, AdminPartialModify
from app.models.node import NodeCreate, NodeModify, NodeStatus, NodeUsageResponse
from app.models.proxy import InboundHost as InboundHostModify
from app.models.service import Service as ServiceModify, ServiceCreate
from app.models.user import (
    ReminderType,
    UserCreate,
    UserDataLimitResetStrategy,
    UserModify,
    UserStatus,
    UserUsageResponse,
)
from app.utils.helpers import calculate_expiration_days, calculate_usage_percent
from config import NOTIFY_DAYS_LEFT, NOTIFY_REACHED_USAGE_PERCENT


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


def assure_node_inbounds(db: Session, inbounds: List[Inbound], node_id: int):
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
    db_inbounds = db.query(Inbound).where(
        and_(Inbound.node_id == node_id, Inbound.tag.in_(tag_deletions))
    )
    for i in db_inbounds:
        db.delete(i)

    for inb in inbounds:
        if inb.tag in current_tags:
            stmt = (
                update(Inbound)
                .where(and_(Inbound.node_id == node_id, Inbound.tag == inb.tag))
                .values(protocol=json.loads(inb.config)["protocol"], config=inb.config)
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
    db: Session, node_id: Optional[int], statuses: Optional[List[UserStatus]] = None
):
    query = (
        db.query(User.id, User.username, User.key, Inbound)
        .distinct()
        .join(Inbound.services)
        .join(Service.users)
        .filter(Inbound.node_id == node_id)
    )
    if isinstance(statuses, list):
        query = query.filter(User.status.in_(statuses))
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


def get_inbound_hosts(db: Session, inbound_id: int) -> List[InboundHost]:
    return db.query(InboundHost).filter(InboundHost.inbound_id == inbound_id).all()


def get_all_inbounds(db: Session):
    return db.query(Inbound).all()


def get_inbound(db: Session, inbound_id: int) -> Inbound | None:
    return db.query(Inbound).filter(Inbound.id == inbound_id).first()


def get_host(db: Session, host_id) -> InboundHost:
    return db.query(InboundHost).filter(InboundHost.id == host_id).first()


def add_host(db: Session, inbound: Inbound, host: InboundHostModify):
    host = InboundHost(
        remark=host.remark,
        address=host.address,
        port=host.port,
        path=host.path,
        sni=host.sni,
        host=host.host,
        inbound=inbound,
        security=host.security,
        alpn=host.alpn,
        fingerprint=host.fingerprint,
    )
    inbound.hosts.append(host)
    db.commit()
    db.refresh(host)
    return host


def update_host(db: Session, db_host: InboundHost, host: InboundHostModify):
    db_host.remark = host.remark
    db_host.address = host.address
    db_host.port = host.port
    db_host.path = host.path
    db_host.sni = host.sni
    db_host.host = host.host
    db_host.security = host.security
    db_host.alpn = host.alpn
    db_host.fingerprint = host.fingerprint
    db.commit()
    db.refresh(db_host)
    return db_host


def update_hosts(
    db: Session, inbound_tag: str, modified_hosts: List[InboundHostModify]
):
    inbound = get_or_create_inbound(db, inbound_tag)
    inbound.hosts = [
        InboundHost(
            remark=host.remark,
            address=host.address,
            port=host.port,
            path=host.path,
            sni=host.sni,
            host=host.host,
            inbound=inbound,
            security=host.security,
            alpn=host.alpn,
            fingerprint=host.fingerprint,
            allowinsecure=host.allowinsecure,
            is_disabled=host.is_disabled,
        )
        for host in modified_hosts
    ]
    db.commit()
    db.refresh(inbound)
    return inbound.hosts


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
        "expire": User.expire.asc(),
        "created_at": User.created_at.asc(),
        "-username": User.username.desc(),
        "-used_traffic": User.used_traffic.desc(),
        "-data_limit": User.data_limit.desc(),
        "-expire": User.expire.desc(),
        "-created_at": User.created_at.desc(),
    },
)


def get_users(
    db: Session,
    offset: Optional[int] = None,
    limit: Optional[int] = None,
    usernames: Optional[List[str]] = None,
    status: Optional[Union[UserStatus, list]] = None,
    sort: Optional[List[UsersSortingOptions]] = None,
    admin: Optional[Admin] = None,
    reset_strategy: Optional[Union[UserDataLimitResetStrategy, list]] = None,
    return_with_count: bool = False,
) -> Union[List[User], Tuple[List[User], int]]:
    query = db.query(User)

    if usernames:
        if len(usernames) == 1:
            query = query.filter(User.username.ilike(f"%{usernames[0]}%"))
        else:
            query = query.filter(User.username.in_(usernames))

    if status:
        if isinstance(status, list):
            query = query.filter(User.status.in_(status))
        else:
            query = query.filter(User.status == status)

    if reset_strategy:
        if isinstance(reset_strategy, list):
            query = query.filter(User.data_limit_reset_strategy.in_(reset_strategy))
        else:
            query = query.filter(User.data_limit_reset_strategy == reset_strategy)

    if admin:
        query = query.filter(User.admin == admin)

    # count it before applying limit and offset
    if return_with_count:
        count = query.count()

    if sort:
        query = query.order_by(*(opt.value for opt in sort))

    if offset:
        query = query.offset(offset)
    if limit:
        query = query.limit(limit)

    if return_with_count:
        return query.all(), count

    return query.all()


def get_user_usages(
    db: Session,
    dbuser: User,
    start: datetime,
    end: datetime,
) -> List[UserUsageResponse]:
    usages = dict()

    for node in db.query(Node).all():
        usages[node.id] = UserUsageResponse(
            node_id=node.id, node_name=node.name, used_traffic=0
        )

    cond = and_(
        NodeUserUsage.user_id == dbuser.id,
        NodeUserUsage.created_at >= start,
        NodeUserUsage.created_at <= end,
    )

    for v in db.query(NodeUserUsage).filter(cond):
        try:
            usages[v.node_id or 0].used_traffic += v.used_traffic
        except KeyError:
            pass

    return list(usages.values())


def get_users_count(db: Session, status: UserStatus = None, admin: Admin = None):
    query = db.query(User.id)
    if admin:
        query = query.filter(User.admin == admin)
    if status:
        query = query.filter(User.status == status)
    return query.count()


def create_user(db: Session, user: UserCreate, admin: Admin = None):
    dbuser = User(
        username=user.username,
        # proxies=proxies,
        key=user.key,
        services=db.query(Service)
        .filter(Service.id.in_(user.services))
        .all(),  # user.services,
        status=user.status,
        data_limit=(user.data_limit or None),
        expire=(user.expire or None),
        admin=admin,
        data_limit_reset_strategy=user.data_limit_reset_strategy,
        note=user.note,
        on_hold_expire_duration=(user.on_hold_expire_duration or None),
        on_hold_timeout=(user.on_hold_timeout or None),
    )
    db.add(dbuser)
    db.commit()
    db.refresh(dbuser)
    return dbuser


def remove_user(db: Session, dbuser: User):
    db.delete(dbuser)
    # db.query(User).filter_by(id=user_id).delete()
    db.commit()


def update_user(db: Session, dbuser: User, modify: UserModify):
    if modify.status is not None:
        dbuser.status = modify.status

    if modify.data_limit is not None:
        dbuser.data_limit = modify.data_limit or None
        if dbuser.status not in (UserStatus.expired, UserStatus.disabled):
            if not dbuser.data_limit or dbuser.used_traffic < dbuser.data_limit:
                if dbuser.status != UserStatus.on_hold:
                    dbuser.status = UserStatus.active

                if not dbuser.data_limit or (
                    calculate_usage_percent(dbuser.used_traffic, dbuser.data_limit)
                    < NOTIFY_REACHED_USAGE_PERCENT
                ):
                    delete_notification_reminder_by_type(
                        db, dbuser.id, ReminderType.data_usage
                    )
            else:
                dbuser.status = UserStatus.limited

    if modify.expire is not None:
        dbuser.expire = modify.expire or None
        if dbuser.status in (UserStatus.active, UserStatus.expired):
            if not dbuser.expire or dbuser.expire > datetime.utcnow():
                dbuser.status = UserStatus.active
                if not dbuser.expire or (
                    calculate_expiration_days(dbuser.expire) > NOTIFY_DAYS_LEFT
                ):
                    delete_notification_reminder_by_type(
                        db, dbuser.id, ReminderType.expiration_date
                    )
            else:
                dbuser.status = UserStatus.expired

    if modify.note is not None:
        dbuser.note = modify.note or None

    if modify.data_limit_reset_strategy is not None:
        dbuser.data_limit_reset_strategy = modify.data_limit_reset_strategy.value

    if modify.on_hold_timeout is not None:
        dbuser.on_hold_timeout = modify.on_hold_timeout

    if modify.on_hold_expire_duration is not None:
        dbuser.on_hold_expire_duration = modify.on_hold_expire_duration

    if modify.services is not None:
        dbuser.services = (
            db.query(Service).filter(Service.id.in_(modify.services)).all()
        )
    dbuser.edit_at = datetime.utcnow()

    db.commit()
    db.refresh(dbuser)
    return dbuser


def reset_user_data_usage(db: Session, dbuser: User):
    usage_log = UserUsageResetLogs(
        user=dbuser,
        used_traffic_at_reset=dbuser.used_traffic,
    )
    db.add(usage_log)

    dbuser.used_traffic = 0
    dbuser.node_usages.clear()
    if dbuser.status == UserStatus.limited:
        dbuser.status = UserStatus.active.value
    db.add(dbuser)

    db.commit()
    db.refresh(dbuser)
    return dbuser


def revoke_user_sub(db: Session, dbuser: User):
    dbuser.key = secrets.token_hex(16)
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

    for dbuser in query.all():
        dbuser.used_traffic = 0
        if dbuser.status not in [
            UserStatus.on_hold,
            UserStatus.expired,
            UserStatus.disabled,
        ]:
            dbuser.status = UserStatus.active
        dbuser.usage_logs.clear()
        dbuser.node_usages.clear()
        db.add(dbuser)

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


def start_user_expire(db: Session, dbuser: User):
    expire = datetime.utcnow() + timedelta(seconds=dbuser.on_hold_expire_duration)
    dbuser.expire = expire
    db.commit()
    db.refresh(dbuser)
    return dbuser


def get_system_usage(db: Session):
    return db.query(System).first()


def get_jwt_secret_key(db: Session):
    return db.query(JWT).first().secret_key


def get_tls_certificate(db: Session):
    return db.query(TLS).first()


def get_admin(db: Session, username: str):
    return db.query(Admin).filter(Admin.username == username).first()


def create_admin(db: Session, admin: AdminCreate):
    dbadmin = Admin(
        username=admin.username,
        hashed_password=admin.hashed_password,
        is_sudo=admin.is_sudo,
    )
    db.add(dbadmin)
    db.commit()
    db.refresh(dbadmin)
    return dbadmin


def update_admin(db: Session, dbadmin: Admin, modified_admin: AdminModify):
    dbadmin.is_sudo = modified_admin.is_sudo
    if dbadmin.hashed_password != modified_admin.hashed_password:
        dbadmin.hashed_password = modified_admin.hashed_password
        dbadmin.password_reset_at = datetime.utcnow()
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
        inbounds=db.query(Inbound).filter(Inbound.id.in_(service.inbounds)).all(),
        users=db.query(User).filter(User.id.in_(service.users)).all(),
    )
    db.add(dbservice)
    db.commit()
    db.refresh(dbservice)
    return dbservice


def get_service(db: Session, service_id: id) -> Service:
    return db.query(Service).filter(Service.id == service_id).first()


def get_services(db: Session) -> List[Service]:
    return db.query(Service).all()


def update_service(db: Session, db_service: Service, modification: ServiceModify):
    if modification.name is not None:
        db_service.name = modification.name

    if modification.inbounds is not None:
        db_service.inbounds = (
            db.query(Inbound).filter(Inbound.id.in_(modification.inbounds)).all()
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
    db: Session, status: Optional[Union[NodeStatus, list]] = None, enabled: bool = None
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


def get_nodes_usage(
    db: Session, start: datetime, end: datetime
) -> List[NodeUsageResponse]:
    usages = dict()

    usages[0] = NodeUsageResponse(  # Main Core
        node_id=None, node_name="Master", uplink=0, downlink=0
    )
    for node in db.query(Node).all():
        usages[node.id] = NodeUsageResponse(
            node_id=node.id, node_name=node.name, uplink=0, downlink=0
        )

    cond = and_(NodeUsage.created_at >= start, NodeUsage.created_at <= end)

    for v in db.query(NodeUsage).filter(cond):
        try:
            usages[v.node_id or 0].uplink += v.uplink
            usages[v.node_id or 0].downlink += v.downlink
        except KeyError:
            pass

    return list(usages.values())


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


def create_notification_reminder(
    db: Session, reminder_type: ReminderType, expires_at: datetime, user_id: int
) -> NotificationReminder:
    reminder = NotificationReminder(
        type=reminder_type, expires_at=expires_at, user_id=user_id
    )
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    return reminder


def get_notification_reminder(
    db: Session,
    user_id: int,
    reminder_type: ReminderType,
) -> Optional[NotificationReminder]:
    reminder = (
        db.query(NotificationReminder)
        .filter(NotificationReminder.user_id == user_id)
        .filter(NotificationReminder.type == reminder_type)
        .first()
    )
    if reminder is None:
        return
    if reminder.expires_at and reminder.expires_at < datetime.utcnow():
        db.delete(reminder)
        db.commit()
        return
    return reminder


def delete_notification_reminder_by_type(
    db: Session, user_id: int, reminder_type: ReminderType
) -> None:
    """Deletes notification reminder filtered by user_id and type if exists"""
    stmt = delete(NotificationReminder).where(
        NotificationReminder.user_id == user_id,
        NotificationReminder.type == reminder_type,
    )
    db.execute(stmt)
    db.commit()
    return


def delete_notification_reminder(db: Session, dbreminder: NotificationReminder) -> None:
    db.delete(dbreminder)
    db.commit()
    return
