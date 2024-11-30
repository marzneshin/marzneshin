from functools import lru_cache
from typing import List
from abc import ABC, abstractmethod

from app.config.env import TELEGRAM_API_TOKEN, WEBHOOK_ADDRESS
from app.models.notification import Notification
from app.notification import telegram, webhook


class BaseNotificationService(ABC):
    @abstractmethod
    async def send_notification(self, message: Notification):
        raise NotImplementedError()


class WebhookNotificationService(BaseNotificationService):
    async def send_notification(self, message: Notification) -> None:
        await webhook.send_notification(message)


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
    services = []

    if TELEGRAM_API_TOKEN:
        services.append(TelegramNotificationService())

    if WEBHOOK_ADDRESS:
        services.append(WebhookNotificationService())

    if not services:
        raise ValueError("No notification services provided.")

    return NotificationManager(services)
