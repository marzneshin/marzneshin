import logging
import aiohttp

from app.config import TELEGRAM_PROXY_URL
from app.config.env import (
    TELEGRAM_API_TOKEN,
    TELEGRAM_ADMIN_ID,
    TELEGRAM_LOGGER_CHANNEL_ID,
)
from app.models.notification import Notification
from app.notification.helper import create_text

logger = logging.getLogger(__name__)


class BotManager:
    _instance = None
    BASE_URL = f"https://api.telegram.org/bot{TELEGRAM_API_TOKEN}/"

    @classmethod
    async def get_instance(cls):
        if cls._instance is None and TELEGRAM_API_TOKEN:
            connector = None
            if TELEGRAM_PROXY_URL:
                connector = aiohttp.TCPConnector(proxy=TELEGRAM_PROXY_URL)

            cls._instance = aiohttp.ClientSession(connector=connector)

            try:
                async with cls._instance.get(f"{cls.BASE_URL}getMe") as resp:
                    if resp.status != 200:
                        logger.error("Telegram API token is not valid.")
            except Exception as e:
                logger.error(f"Failed to connect to Telegram API: {e}")
        return cls._instance


async def send_message(
    message: str,
    parse_mode: str = "HTML",
):
    if not (session := await BotManager.get_instance()):
        return

    recipient_ids = []
    if TELEGRAM_ADMIN_ID:
        recipient_ids.extend(TELEGRAM_ADMIN_ID)
    if TELEGRAM_LOGGER_CHANNEL_ID:
        recipient_ids.append(TELEGRAM_LOGGER_CHANNEL_ID)

    for recipient_id in recipient_ids:
        if not recipient_id:
            continue

        try:
            params = {
                "chat_id": recipient_id,
                "text": message,
                "parse_mode": parse_mode,
            }

            async with session.post(
                f"{BotManager.BASE_URL}sendMessage", json=params
            ) as resp:
                if resp.status != 200:
                    response_data = await resp.json()
                    logger.error(f"Telegram API error: {response_data}")
        except Exception as e:
            logger.error(f"Failed to telegram send message: {e}")


async def send_notification(notif: Notification):
    text = create_text(notif)
    await send_message(text)
