from abc import ABC, abstractmethod
from enum import Enum
from functools import lru_cache
from typing import Any, Dict, Type, Optional, Union

from app.models.admin import Admin
from app.models.notification import (
    Notification,
    AdminNotif,
    UserNotification,
    UserCreated,
    UserUpdated,
    UserActivated,
    UserDeactivated,
    UserDeleted,
    UserEnabled,
    UserDisabled,
    UserDataUsageReset,
    UserSubscriptionRevoked,
    ReachedUsagePercent,
    ReachedDaysLeft,
)
from app.models.user import UserResponse


class NotificationFactory(ABC):
    @abstractmethod
    def create_notification(self, action: Enum, **kwargs: Any) -> Notification:
        raise NotImplementedError()


class AdminNotificationFactory(NotificationFactory):
    def create_notification(self, action: Enum, **kwargs: Any) -> Notification:
        pass


class UserNotificationFactory(NotificationFactory):
    Action = UserNotification.Action

    notification_classes: Dict[
        UserNotification.Action, Type[UserNotification]
    ] = {
        Action.user_created: UserCreated,
        Action.user_updated: UserUpdated,
        Action.user_activated: UserActivated,
        Action.user_deactivated: UserDeactivated,
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
        action: UserNotification.Action,
        user: UserResponse,
        by: Optional[Admin] = None,
        **kwargs: Any
    ) -> UserNotification:
        notification_class = self.notification_classes.get(action)
        return notification_class(user=user, by=by, **kwargs)


class NotificationStrategy:
    def __init__(self):
        self.user_factory = UserNotificationFactory()
        self.admin_factory = AdminNotificationFactory()

    def create_notification(
        self, action: Enum, **kwargs: Any
    ) -> Union[UserNotification, AdminNotif]:
        if isinstance(action, UserNotification.Action):
            return self.user_factory.create_notification(action, **kwargs)
        elif isinstance(action, AdminNotif.Action):
            return self.admin_factory.create_notification(action, **kwargs)


@lru_cache(maxsize=1)
def get_notification_strategy() -> NotificationStrategy:
    return NotificationStrategy()
