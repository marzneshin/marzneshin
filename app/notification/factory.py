from functools import lru_cache
from abc import ABC, abstractmethod
from typing import Any, Dict, Type, Optional, Union
from enum import Enum

from app.models.admin import Admin
from app.models.user import UserResponse
from app.models.notification import (
    Notification,
    AdminNotif,
    UserNotif,
    UserCreated,
    UserUpdated,
    UserActivated,
    UserDeleted,
    UserEnabled,
    UserDisabled,
    UserDataUsageReset,
    UserSubscriptionRevoked,
    ReachedUsagePercent,
    ReachedDaysLeft,
)


class NotificationFactory(ABC):
    @abstractmethod
    def create_notification(self, action: Enum, **kwargs: Any) -> Notification:
        raise NotImplementedError()


class AdminNotificationFactory(NotificationFactory):

    def create_notification(self, action: Enum, **kwargs: Any) -> Notification:
        pass


class UserNotificationFactory(NotificationFactory):

    Action = UserNotif.Action

    notification_classes: Dict[UserNotif.Action, Type[UserNotif]] = {
        Action.user_created: UserCreated,
        Action.user_updated: UserUpdated,
        Action.user_activated: UserActivated,
        Action.user_deleted: UserDeleted,
        Action.user_enabled: UserEnabled,
        Action.user_disabled: UserDisabled,
        Action.data_usage_reset: UserDataUsageReset,
        Action.subscription_revoked: UserSubscriptionRevoked,
        Action.reached_usage_percent: ReachedUsagePercent,
        Action.reached_days_left: ReachedDaysLeft,
    }

    def create_notification(
        self,
        action: UserNotif.Action,
        user: UserResponse,
        by: Optional[Admin] = None,
        **kwargs: Any
    ) -> UserNotif:
        notification_class = self.notification_classes.get(action)
        return notification_class(user=user, by=by, **kwargs)


class NotificationStrategy:
    def __init__(self):
        self.user_factory = UserNotificationFactory()
        self.admin_factory = AdminNotificationFactory()

    def create_notification(
        self, action: Enum, **kwargs: Any
    ) -> Union[UserNotif, AdminNotif]:
        if isinstance(action, UserNotif.Action):
            return self.user_factory.create_notification(action, **kwargs)
        elif isinstance(action, AdminNotif.Action):
            return self.admin_factory.create_notification(action, **kwargs)


@lru_cache(maxsize=1)
def get_notification_strategy() -> NotificationStrategy:
    return NotificationStrategy()
