import asyncio

from sqlalchemy import case
from sqlalchemy.orm import Session

from app.config import NOTIFY_REACHED_USAGE_PERCENT
from app.db.models import User
from app.models.notification import UserNotification
from app.models.user import UserResponse
from app.notification.notifiers import notify


async def data_usage_percent_reached(db: Session, users_usage: list) -> None:
    """
    Monitors data usage of active users and sends a notification if usage exceeds NOTIFY_REACHED_USAGE_PERCENT.

    This function performs the following steps:
    - Receives a list of user data usage, where each user has an ID and the amount of data they have used from all nodes.
    - If the new total data usage exceeds NOTIFY_REACHED_USAGE_PERCENT of the user's data limit, it sends a notification.

    This function is called when user data usage updates occur.

    """

    users_usage_dict = {user["id"]: user["value"] for user in users_usage}

    case_stmt = case(
        *[
            (User.id == user_id, User.used_traffic + increase_amount)
            for user_id, increase_amount in users_usage_dict.items()
        ],
        else_=User.used_traffic,
    )

    exceeding_users = (
        db.query(User)
        .filter(
            User.id.in_(users_usage_dict.keys()),
            User.data_limit.isnot(None),
            User.data_limit > 0,
            (User.used_traffic / User.data_limit) * 100
            < NOTIFY_REACHED_USAGE_PERCENT,
            (case_stmt / User.data_limit) * 100 > NOTIFY_REACHED_USAGE_PERCENT,
        )
        .all()
    )

    for user in exceeding_users:
        added_traffic = users_usage_dict[user.id]
        user.used_traffic += added_traffic
        asyncio.ensure_future(
            notify(
                action=UserNotification.Action.reached_usage_percent,
                user=UserResponse.model_validate(user),
            )
        )

    db.expunge_all()
