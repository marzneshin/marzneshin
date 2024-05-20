from fastapi import APIRouter

from app import __version__
from app.db import crud
from app.db.models import Admin as DBAdmin, User
from app.db.models import Node
from app.dependencies import DBDep, AdminDep, SudoAdminDep
from app.models.node import NodeStatus
from app.models.system import SystemStats, UsersStats, NodesStats, AdminsStats
from app.models.user import UserStatus

router = APIRouter(tags=["System"], prefix="/system")


@router.get("/stats/admins", response_model=AdminsStats)
def get_admins_stats(db: DBDep, admin: SudoAdminDep):
    return AdminsStats(total=db.query(DBAdmin).count())


@router.get("/stats/nodes", response_model=NodesStats)
def get_nodes_stats(db: DBDep, admin: SudoAdminDep):
    return NodesStats(
        total=db.query(Node).count(),
        healthy=db.query(Node).filter(Node.status == NodeStatus.healthy).count(),
        unhealthy=db.query(Node).filter(Node.status == NodeStatus.unhealthy).count(),
    )


@router.get("/stats/users", response_model=UsersStats)
def get_users_stats(db: DBDep, admin: AdminDep):
    return UsersStats(
        total=crud.get_users_count(db, admin=admin if not admin.is_sudo else None),
        active=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, status=UserStatus.active
        ),
        on_hold=crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            status=UserStatus.on_hold,
        ),
        expired=crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            status=UserStatus.expired,
        ),
        limited=crud.get_users_count(
            db,
            admin=admin if not admin.is_sudo else None,
            status=UserStatus.limited,
        ),
        online=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, online=True
        ),
        recent_subscription_updates=list(
            i[0]
            for i in db.query(User.username)
            .filter(User.sub_updated_at != None)
            .order_by(User.sub_updated_at)
            .limit(5)
        ),
    )
