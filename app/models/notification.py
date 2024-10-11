from typing import Optional
from datetime import datetime as dt
from enum import Enum

from pydantic import BaseModel

from app.models.admin import Admin
from app.models.user import UserResponse


class Notification(BaseModel):

    created_at: float = dt.utcnow().timestamp()


class AdminNotif(Notification):
    pass


class UserNotif(Notification):
    class Action(str, Enum):
        user_created = "user_created"
        user_updated = "user_updated"
        user_activated = "user_activated"
        user_deleted = "user_deleted"
        user_enabled = "user_enabled"
        user_disabled = "user_disabled"
        data_usage_reset = "data_usage_reset"
        subscription_revoked = "subscription_revoked"
        reached_usage_percent = "reached_usage_percent"
        reached_days_left = "reached_days_left"


class UserCreated(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_created
    user: UserResponse
    by: Admin


class UserUpdated(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_updated
    user: UserResponse
    by: Admin


class UserActivated(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_activated
    user: UserResponse
    by: Optional[Admin] = None


class UserDeleted(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_deleted
    user: UserResponse
    by: Admin


class UserEnabled(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_enabled
    user: UserResponse
    by: Optional[Admin] = None


class UserDisabled(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_disabled
    user: UserResponse
    by: Optional[Admin] = None


class UserDataUsageReset(UserNotif):
    action: UserNotif.Action = UserNotif.Action.data_usage_reset
    user: UserResponse
    by: Optional[Admin] = None


class UserSubscriptionRevoked(UserNotif):
    action: UserNotif.Action = UserNotif.Action.subscription_revoked
    user: UserResponse
    by: Admin


class ReachedUsagePercent(UserNotif):
    action: UserNotif.Action = UserNotif.Action.reached_usage_percent
    user: UserResponse


class ReachedDaysLeft(UserNotif):
    action: UserNotif.Action = UserNotif.Action.reached_days_left
    user: UserResponse
