import logging
from datetime import datetime

from app import marznode
from app.db import crud, GetDB, get_users
from app.models.user import UserDataUsageResetStrategy

logger = logging.getLogger(__name__)

reset_strategy_to_days = {
    UserDataUsageResetStrategy.day.value: 1,
    UserDataUsageResetStrategy.week.value: 7,
    UserDataUsageResetStrategy.month.value: 30,
    UserDataUsageResetStrategy.year.value: 365,
}


async def reset_user_data_usage():
    now = datetime.utcnow()
    with GetDB() as db:
        for user in get_users(
            db,
            reset_strategy=[
                UserDataUsageResetStrategy.day.value,
                UserDataUsageResetStrategy.week.value,
                UserDataUsageResetStrategy.month.value,
                UserDataUsageResetStrategy.year.value,
            ],
        ):
            last_reset_time = user.traffic_reset_at or user.created_at
            num_days_to_reset = reset_strategy_to_days[
                user.data_limit_reset_strategy
            ]

            if not (now - last_reset_time).days >= num_days_to_reset:
                continue

            was_active = user.is_active
            crud.reset_user_data_usage(db, user)
            # make user active if limited on usage reset
            if user.is_active and not was_active:
                marznode.operations.update_user(user)
                user.activated = True
                db.commit()

            logger.info("User data usage reset for User `%s`", user.username)
