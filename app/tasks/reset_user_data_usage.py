import logging
from datetime import datetime

from app import marznode
from app.db import crud, GetDB, get_users
from app.models.user import UserDataLimitResetStrategy, UserStatus

logger = logging.getLogger(__name__)

reset_strategy_to_days = {
    UserDataLimitResetStrategy.day.value: 1,
    UserDataLimitResetStrategy.week.value: 7,
    UserDataLimitResetStrategy.month.value: 30,
    UserDataLimitResetStrategy.year.value: 365,
}


async def reset_user_data_usage():
    now = datetime.utcnow()
    with GetDB() as db:
        for user in get_users(
            db,
            reset_strategy=[
                UserDataLimitResetStrategy.day.value,
                UserDataLimitResetStrategy.week.value,
                UserDataLimitResetStrategy.month.value,
                UserDataLimitResetStrategy.year.value,
            ],
        ):
            last_reset_time = user.traffic_reset_at or user.created_at
            num_days_to_reset = reset_strategy_to_days[
                user.data_limit_reset_strategy
            ]

            if not (now - last_reset_time).days >= num_days_to_reset:
                continue

            old_status = user.status
            crud.reset_user_data_usage(db, user)
            # make user active if limited on usage reset
            if (
                user.enabled
                and user.status == UserStatus.active
                and old_status == UserStatus.limited
            ):
                await marznode.operations.update_user(user)

            logger.info(f'User data usage reset for User "{user.username}"')
