from fastapi import APIRouter
from sqlalchemy import select, func

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
async def get_subscription_settings(db: DBDep, admin: SudoAdminDep):
    return await db.scalar(select(Settings.subscription))


@router.put("/settings/subscription", response_model=SubscriptionSettings)
async def update_subscription_settings(
    db: DBDep, modifications: SubscriptionSettings, admin: SudoAdminDep
):
    settings = await db.scalar(select(Settings))
    settings.subscription = modifications.model_dump(mode="json")
    await db.commit()
    return settings.subscription


@router.get("/settings/telegram", response_model=TelegramSettings | None)
async def get_telegram_settings(db: DBDep, admin: SudoAdminDep):
    return await db.scalar(select(Settings.telegram))


@router.put("/settings/telegram", response_model=TelegramSettings | None)
async def update_telegram_settings(
    db: DBDep, new_telegram: TelegramSettings | None, admin: SudoAdminDep
):
    settings = await db.scalar(select(Settings.telegram))
    settings.telegram = new_telegram
    await db.commit()
    return settings.telegram


@router.get("/stats/admins", response_model=AdminsStats)
async def get_admins_stats(db: DBDep, admin: SudoAdminDep):
    total = await db.execute(select(func.count(DBAdmin.id)))
    return AdminsStats(total=total.scalar())


@router.get("/stats/nodes", response_model=NodesStats)
async def get_nodes_stats(db: DBDep, admin: SudoAdminDep):
    total = await db.execute(select(func.count(Node.id)))
    healthy = await db.execute(
        select(func.count(Node.id)).filter(Node.status == NodeStatus.healthy)
    )
    unhealthy = await db.execute(
        select(func.count(Node.id)).filter(Node.status == NodeStatus.unhealthy)
    )
    return NodesStats(
        total=total.scalar(),
        healthy=healthy.scalar(),
        unhealthy=unhealthy.scalar(),
    )


@router.get("/stats/traffic", response_model=TrafficUsageSeries)
async def get_total_traffic_stats(
    db: DBDep, admin: AdminDep, start_date: StartDateDep, end_date: EndDateDep
):
    return await crud.get_total_usages(db, admin, start_date, end_date)


@router.get("/stats/traffic", response_model=TrafficUsageSeries)
async def get_total_traffic_stats(
    db: DBDep, admin: AdminDep, start_date: StartDateDep, end_date: EndDateDep
):
    return await crud.get_total_usages(db, admin, start_date, end_date)


@router.get("/stats/users", response_model=UsersStats)
async def get_users_stats(db: DBDep, admin: AdminDep):
    return UsersStats(
        total=await crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None
        ),
        active=await crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, is_active=True
        ),
        on_hold=await crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            expire_strategy=UserExpireStrategy.START_ON_FIRST_USE,
        ),
        expired=await crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            expired=True,
        ),
        limited=await crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            data_limit_reached=True,
        ),
        online=await crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, online=True
        ),
    )
