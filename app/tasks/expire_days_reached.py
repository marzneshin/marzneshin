import asyncio
from datetime import datetime, timedelta

from app.config import NOTIFY_DAYS_LEFT
from app.db import GetDB
from app.db.models import User
from app.models.notification import UserNotification
from app.models.user import UserResponse
from app.notification.notifiers import notify


async def expire_days_reached():
    """
    Identifies users whose expiration days have reached a predefined notification period and sends notifications.

    This function checks each active user with an expiration date set and determines if they are within a
    specific notification window (`NOTIFY_DAYS_LEFT` days before expiration). If the condition is met,
    it sends a notification.

    How it works:
    - The current UTC time is obtained.
    - For each user in the database who is activated and currently active, check if their expiration date is set.
    - If the user's expiration date is within the `NOTIFY_DAYS_LEFT` threshold (plus a 30-second margin),
      log the event and trigger a notification.
    """

    now = datetime.utcnow()
    cleft = timedelta(days=NOTIFY_DAYS_LEFT) + now
    cright = timedelta(days=NOTIFY_DAYS_LEFT, seconds=30) + now
    with GetDB() as db:
        users = db.query(User).filter(
            User.is_active == True,
            User.activated == True,
            User.expire_date.isnot(None),
            User.expire_date.between(cleft, cright),
        )
        for user in users:
            asyncio.ensure_future(
                notify(
                    action=UserNotification.Action.reached_days_left,
                    user=UserResponse.model_validate(user),
                )
            )
