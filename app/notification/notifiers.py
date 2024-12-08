from enum import Enum
from app.notification import (
    get_notification_strategy,
    get_notification_manager,
)


async def notify(action: Enum, **kwargs) -> None:
    try:
        manager = get_notification_manager()
    except ValueError:
        return

    strategy = get_notification_strategy()
    notification = strategy.create_notification(action=action, **kwargs)

    await manager.send_notification(notification)
