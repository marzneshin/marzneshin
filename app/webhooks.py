from fastapi import APIRouter
from pydantic import BaseModel

from app.models.notification import (
    UserCreated,
    UserDeleted,
    UserActivated,
    UserDeactivated,
    UserEnabled,
    UserDisabled,
    UserDataUsageReset,
    UserSubscriptionRevoked,
    ReachedUsagePercent,
    UserUpdated,
    ReachedDaysLeft,
)

webhooks_router = APIRouter()


class Subscription(BaseModel):
    username: str
    monthly_fee: float
    start_date: int


@webhooks_router.post("user-created")
def user_created(body: UserCreated):
    pass


@webhooks_router.post("user-updated")
def user_updated(body: UserUpdated):
    pass


@webhooks_router.post("user-activated")
def user_activated(body: UserActivated):
    pass


@webhooks_router.post("user-deactivated")
def user_deactivated(body: UserDeactivated):
    pass


@webhooks_router.post("user-deleted")
def user_deleted(body: UserDeleted):
    pass


@webhooks_router.post("user-enabled")
def user_enabled(body: UserEnabled):
    pass


@webhooks_router.post("user-disabled")
def user_disabled(body: UserDisabled):
    pass


@webhooks_router.post("user-data-usage-reset")
def user_data_usage_reset(body: UserDataUsageReset):
    pass


@webhooks_router.post("user-subscription-revoked")
def user_subscription_revoked(body: UserSubscriptionRevoked):
    pass


@webhooks_router.post("user-reached-usage")
def user_reached_usage_percent(body: ReachedUsagePercent):
    pass


@webhooks_router.post("user-reached-days")
def user_reached_days(body: ReachedDaysLeft):
    pass
