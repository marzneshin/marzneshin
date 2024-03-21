from datetime import datetime as dt
from typing import Optional

from app import telegram
from app.db import Session, create_notification_reminder
from app.db.models import UserStatus
from app.models.admin import Admin
from app.models.user import ReminderType, UserResponse
from app.utils.notification import (
    Notification,
    ReachedDaysLeft,
    ReachedUsagePercent,
    UserCreated,
    UserDataUsageReset,
    UserDeleted,
    UserDisabled,
    UserEnabled,
    UserExpired,
    UserLimited,
    UserSubscriptionRevoked,
    UserUpdated,
    notify,
)


async def status_change(
    username: str, status: UserStatus, user: UserResponse, by: Optional[Admin] = None
) -> None:
    try:
        await telegram.report_status_change(username, status)
    except Exception:
        pass
    if status == UserStatus.limited:
        await notify(
            UserLimited(
                username=username, action=Notification.Type.user_limited, user=user
            )
        )
    elif status == UserStatus.expired:
        await notify(
            UserExpired(
                username=username, action=Notification.Type.user_expired, user=user
            )
        )
    elif status == UserStatus.disabled:
        await notify(
            UserDisabled(
                username=username,
                action=Notification.Type.user_disabled,
                user=user,
                by=by,
            )
        )
    elif status == UserStatus.active:
        await notify(
            UserEnabled(
                username=username,
                action=Notification.Type.user_enabled,
                user=user,
                by=by,
            )
        )


async def user_created(user: UserResponse, user_id: int, by: Admin) -> None:
    await telegram.report_new_user(
        user_id=user_id,
        username=user.username,
        by=by.username,
        expire_date=user.expire,
        data_limit=user.data_limit,
        # proxies=[]
        services=user.services,
    )

    await notify(
        UserCreated(
            username=user.username,
            action=Notification.Type.user_created,
            by=by,
            user=user,
        )
    )


async def user_updated(user: UserResponse, by: Admin) -> None:
    try:
        await telegram.report_user_modification(
            username=user.username,
            expire_date=user.expire,
            data_limit=user.data_limit,
            services=user.services,
            by=by.username,
        )
    except Exception:
        pass
    await notify(
        UserUpdated(
            username=user.username,
            action=Notification.Type.user_updated,
            by=by,
            user=user,
        )
    )


async def user_deleted(username: str, by: Admin) -> None:
    try:
        await telegram.report_user_deletion(username=username, by=by.username)
    except Exception:
        pass
    await notify(
        UserDeleted(username=username, action=Notification.Type.user_deleted, by=by)
    )


async def user_data_usage_reset(user: UserResponse, by: Admin) -> None:
    try:
        await telegram.report_user_usage_reset(
            username=user.username,
            by=by.username,
        )
    except Exception:
        pass
    await notify(
        UserDataUsageReset(
            username=user.username,
            action=Notification.Type.data_usage_reset,
            by=by,
            user=user,
        )
    )


async def user_subscription_revoked(user: UserResponse, by: Admin) -> None:
    try:
        await telegram.report_user_subscription_revoked(
            username=user.username,
            by=by.username,
        )
    except Exception:
        pass
    await notify(
        UserSubscriptionRevoked(
            username=user.username,
            action=Notification.Type.subscription_revoked,
            by=by,
            user=user,
        )
    )


async def data_usage_percent_reached(
    db: Session,
    percent: float,
    user: UserResponse,
    user_id: int,
    expire: Optional[int] = None,
) -> None:
    await notify(
        ReachedUsagePercent(username=user.username, user=user, used_percent=percent)
    )
    await create_notification_reminder(
        db,
        ReminderType.data_usage,
        expires_at=dt.utcfromtimestamp(expire) if expire else None,
        user_id=user_id,
    )


async def expire_days_reached(
    db: Session, days: int, user: UserResponse, user_id: int, expire: int
) -> None:
    await notify(ReachedDaysLeft(username=user.username, user=user, days_left=days))
    await create_notification_reminder(
        db,
        ReminderType.expiration_date,
        expires_at=dt.utcfromtimestamp(expire),
        user_id=user_id,
    )
