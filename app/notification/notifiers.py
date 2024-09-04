from enum import Enum
from app.notification import get_notification_strategy,get_notification_manager

async def notify(action: Enum,**kwargs) -> None:
    strategy = get_notification_strategy()
    notification = strategy.create_notification(action=action,**kwargs)
    
    manager = get_notification_manager()
    await manager.send_notification(notification)
