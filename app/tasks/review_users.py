import asyncio
import logging
from datetime import datetime, timedelta
from typing import TYPE_CHECKING

from app import marznode
from app.db import (
    GetDB,
    get_users,
)
from app.models.notification import UserNotification
from app.models.user import (
    UserResponse,
    UserExpireStrategy,
)
from app.notification import notify

if TYPE_CHECKING:
    pass


logger = logging.getLogger(__name__)


async def review_users():
    now = datetime.utcnow()
    with GetDB() as db:
        for user in get_users(db, activated=True, is_active=False):
            """looking for expired/to be limited users who are still active"""

            marznode.operations.update_user(user, remove=True)
            user.activated = False
            db.commit()
            db.refresh(user)

            asyncio.ensure_future(
                notify(
                    action=UserNotification.Action.user_deactivated,
                    user=UserResponse.model_validate(user),
                )
            )

            logger.info(
                "User `%s` activation state changed to `%s`",
                user.username,
                str(user.activated),
            )

        for user in get_users(
            db,
            expire_strategy=UserExpireStrategy.START_ON_FIRST_USE,
            is_active=True,
        ):
            """looking for to be activated, on hold users"""
            base_time = user.edit_at or user.created_at

            # Check if the user is online After or at 'base_time' or...
            # If the user didn't connect until activation_deadline; change status to "Active"
            if not (
                (user.online_at and base_time <= user.online_at)
                or (
                    user.activation_deadline
                    and (user.activation_deadline <= now)
                )
            ):
                continue

            user.expire_date = datetime.utcnow() + timedelta(
                seconds=user.usage_duration
            )
            user.expire_strategy = UserExpireStrategy.FIXED_DATE
            db.commit()
            db.refresh(user)
            logger.info("on hold user `%s` has been activated", user.username)
