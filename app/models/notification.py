from typing import Optional
from datetime import datetime as dt
from enum import Enum

from pydantic import BaseModel, Field

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
    by: Admin
    user: UserResponse


class UserUpdated(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_updated
    by: Admin
    user: UserResponse


class UserActivated(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_activated
    by: Admin = None
    user: UserResponse


class UserDeleted(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_deleted
    user: UserResponse
    by: Admin


class UserEnabled(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_enabled
    by: Admin = None
    user: UserResponse


class UserDisabled(UserNotif):
    action: UserNotif.Action = UserNotif.Action.user_disabled
    by: Optional[Admin] = None
    user: UserResponse


class UserDataUsageReset(UserNotif):
    action: UserNotif.Action = UserNotif.Action.data_usage_reset
    by: Admin
    user: UserResponse


class UserSubscriptionRevoked(UserNotif):
    action: UserNotif.Action = UserNotif.Action.subscription_revoked
    by: Admin
    user: UserResponse


class ReachedUsagePercent(UserNotif):
    action: UserNotif.Action = UserNotif.Action.reached_usage_percent
    user: UserResponse


class ReachedDaysLeft(UserNotif):
    action: UserNotif.Action = UserNotif.Action.reached_days_left
    user: UserResponse
