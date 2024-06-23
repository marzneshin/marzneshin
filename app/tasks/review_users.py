import asyncio
import logging
from datetime import datetime, timedelta
from typing import TYPE_CHECKING

from sqlalchemy.orm import Session

from app import marznode
from app.config.env import (
    NOTIFY_DAYS_LEFT,
    NOTIFY_REACHED_USAGE_PERCENT,
    WEBHOOK_ADDRESS,
)
from app.db import (
    GetDB,
    get_notification_reminder,
    get_users,
    update_user_status,
)
from app.models.user import (
    ReminderType,
    UserResponse,
    UserStatus,
    UserExpireStrategy,
)
from app.utils import report
from app.utils.helpers import (
    calculate_expiration_days,
    calculate_usage_percent,
)

if TYPE_CHECKING:
    from app.db.models import User


logger = logging.getLogger(__name__)


def add_notification_reminders(
    db: Session, user: "User", now: datetime = datetime.utcnow()
) -> None:
    if user.data_limit:
        usage_percent = calculate_usage_percent(
            user.used_traffic, user.data_limit
        )
        if (usage_percent >= NOTIFY_REACHED_USAGE_PERCENT) and (
            not get_notification_reminder(db, user.id, ReminderType.data_usage)
        ):
            report.data_usage_percent_reached(
                db,
                usage_percent,
                UserResponse.model_validate(user),
                user.id,
                user.expire_date,
            )

    if user.expire_date and ((now - user.created_at).days >= NOTIFY_DAYS_LEFT):
        expire_days = calculate_expiration_days(user.expire_date)
        if (expire_days <= NOTIFY_DAYS_LEFT) and (
            not get_notification_reminder(
                db, user.id, ReminderType.expiration_date
            )
        ):
            report.expire_days_reached(
                db,
                expire_days,
                UserResponse.model_validate(user),
                user.id,
                user.expire_date,
            )


async def review_users():
    now = datetime.utcnow()
    with GetDB() as db:
        for user in get_users(db, status=UserStatus.active):
            """looking for to be expired/limited users"""
            limited = user.data_limit and user.used_traffic >= user.data_limit
            expired = user.expire_date and user.expire_date <= now
            if limited:
                status = UserStatus.limited
            elif expired:
                status = UserStatus.expired
            else:
                if WEBHOOK_ADDRESS:
                    add_notification_reminders(db, user, now)
                continue

            await marznode.operations.remove_user(user)
            update_user_status(db, user, status)

            asyncio.create_task(
                report.status_change(
                    user.username,
                    user.status,
                    UserResponse.model_validate(user),
                )
            )

            logger.info(
                f"User `%s` status changed to `%s`",
                user.username,
                status.value,
            )

        for user in get_users(
            db, expire_strategy=UserExpireStrategy.START_ON_FIRST_USE
        ):
            """looking for to be activated users"""
            base_time = user.edit_at or user.created_at

            # Check if the user is online After or at 'base_time' or...
            # If the user didn't connect within the timeout period, change status to "Active"
            if (user.online_at and base_time <= user.online_at) or (
                user.activation_deadline and (user.activation_deadline <= now)
            ):
                pass
            else:
                continue

            user.expire_date = datetime.utcnow() + timedelta(
                seconds=user.usage_duration
            )
            user.expire_strategy = UserExpireStrategy.FIXED_DATE
            db.commit()
            db.refresh(user)
            asyncio.create_task(
                report.status_change(
                    user.username,
                    user.status,
                    UserResponse.model_validate(user),
                )
            )
            logger.info("on hold user `%s` has been activated", user.username)
