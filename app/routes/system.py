from fastapi import APIRouter

from app import __version__
from app.db import crud
from app.db.models import Admin as DBAdmin, User
from app.db.models import Node
from app.dependencies import DBDep, AdminDep
from app.models.node import NodeStatus
from app.models.system import SystemStats
from app.models.user import UserStatus

router = APIRouter(tags=["System"], prefix="/system")


@router.get("/stats", response_model=SystemStats)
def get_system_stats(db: DBDep, admin: AdminDep):
    return SystemStats(
        version=__version__,
        total_users=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None
        ),
        active_users=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, status=UserStatus.active
        ),
        on_hold_users=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, status=UserStatus.on_hold
        ),
        expired_users=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, status=UserStatus.expired
        ),
        limited_users=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, status=UserStatus.limited
        ),
        online_users=crud.get_users_count(
            db, admin=admin if not admin.is_sudo else None, online=True
        ),
        recent_subscription_update_usernames=list(
            i[0]
            for i in db.query(User.username)
            .filter(User.sub_updated_at != None)
            .order_by(User.sub_updated_at)
            .limit(5)
        ),
        total_admins=db.query(DBAdmin).count(),
        total_nodes=db.query(Node).count(),
        healthy_nodes=db.query(Node).filter(Node.status == NodeStatus.healthy).count(),
        unhealthy_nodes=db.query(Node)
        .filter(Node.status == NodeStatus.unhealthy)
        .count(),
    )
