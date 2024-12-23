from fastapi import APIRouter

from app.db import crud
from app.db.models import Admin as DBAdmin, Settings
from app.db.models import Node
from app.dependencies import (
    DBDep,
    AdminDep,
    SudoAdminDep,
    EndDateDep,
    StartDateDep,
)
from app.models.node import NodeStatus
from app.models.settings import SubscriptionSettings, TelegramSettings
from app.models.system import (
    UsersStats,
    NodesStats,
    AdminsStats,
    TrafficUsageSeries,
)
from app.models.user import UserExpireStrategy

router = APIRouter(tags=["System"], prefix="/system")


@router.get("/settings/subscription", response_model=SubscriptionSettings)
def get_subscription_settings(db: DBDep, admin: SudoAdminDep):
    return db.query(Settings.subscription).first()[0]


@router.put("/settings/subscription", response_model=SubscriptionSettings)
def update_subscription_settings(
    db: DBDep, modifications: SubscriptionSettings, admin: SudoAdminDep
):
    settings = db.query(Settings).first()
    settings.subscription = modifications.model_dump(mode="json")
    db.commit()
    return settings.subscription


@router.get("/settings/telegram", response_model=TelegramSettings | None)
def get_telegram_settings(db: DBDep, admin: SudoAdminDep):
    return db.query(Settings.telegram).first().telegram


@router.put("/settings/telegram", response_model=TelegramSettings | None)
def update_telegram_settings(
    db: DBDep, new_telegram: TelegramSettings | None, admin: SudoAdminDep
):
    settings = db.query(Settings.telegram).first()
    settings.telegram = new_telegram
    db.commit()
    return settings.telegram


@router.get("/stats/admins", response_model=AdminsStats)
def get_admins_stats(
    db: DBDep,
    admin: SudoAdminDep,
    start_date: StartDateDep,
    end_date: EndDateDep,
):
    return crud.admins_stats(db, start_date, end_date)


@router.get("/stats/nodes", response_model=NodesStats)
def get_nodes_stats(db: DBDep, admin: SudoAdminDep):
    return NodesStats(
        total=db.query(Node).count(),
        healthy=db.query(Node)
        .filter(Node.status == NodeStatus.healthy)
        .count(),
        unhealthy=db.query(Node)
        .filter(Node.status == NodeStatus.unhealthy)
        .count(),
    )


@router.get("/stats/traffic", response_model=TrafficUsageSeries)
def get_total_traffic_stats(
    db: DBDep, admin: AdminDep, start_date: StartDateDep, end_date: EndDateDep
):
    return crud.get_total_usages(db, admin, start_date, end_date)


@router.get("/stats/users", response_model=UsersStats)
def get_users_stats(db: DBDep, admin: AdminDep):
    return UsersStats(
        total=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None
        ),
        active=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, is_active=True
        ),
        on_hold=crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            expire_strategy=UserExpireStrategy.START_ON_FIRST_USE,
        ),
        expired=crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            expired=True,
        ),
        limited=crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            data_limit_reached=True,
        ),
        online=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, online=True
        ),
    )
