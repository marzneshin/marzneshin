from pydantic import BaseModel


class SystemStats(BaseModel):
    version: str

    total_users: int
    active_users: int
    on_hold_users: int
    expired_users: int
    limited_users: int
    online_users: int

    recent_subscription_update_usernames: list[str]

    total_admins: int

    total_nodes: int
    healthy_nodes: int
    unhealthy_nodes: int


class UsersStats(BaseModel):
    total: int
    active: int
    on_hold: int
    expired: int
    limited: int
    online: int


class AdminsStats(BaseModel):
    total: int


class NodesStats(BaseModel):
    total: int
    healthy: int
    unhealthy: int


class TrafficUsageSeries(BaseModel):
    step: int = 3600
    total: int = 0
    usages: list[tuple[int, int]]
    total: int
