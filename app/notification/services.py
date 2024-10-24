from functools import lru_cache
from typing import List
from abc import ABC, abstractmethod

from app.models.notification import Notification
from app.notification import telegram


class BaseNotificationService(ABC):
    @abstractmethod
    async def send_notification(self, message: Notification):
        raise NotImplementedError()


class WebhookNotificationService(BaseNotificationService):
    async def send_notification(self, message: Notification) -> None:

        print("Not implemented yet")


class TelegramNotificationService(BaseNotificationService):

    async def send_notification(self, message: Notification) -> None:

        await telegram.send_notification(message)


class NotificationManager:
    def __init__(self, strategies: List[BaseNotificationService]) -> None:
        self.strategies = strategies

    async def send_notification(self, message: Notification) -> None:
        for strategy in self.strategies:
            await strategy.send_notification(message)


@lru_cache(maxsize=1)
def get_notification_manager() -> NotificationManager:
    return NotificationManager(
        [
            TelegramNotificationService(),
            WebhookNotificationService(),
        ]
    )
