import logging

from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.client.session.aiohttp import AiohttpSession
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramAPIError
from aiogram.types import InlineKeyboardMarkup

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

    @classmethod
    async def get_instance(cls):
        if cls._instance is None and TELEGRAM_API_TOKEN:
            if TELEGRAM_PROXY_URL:
                session = AiohttpSession(proxy=TELEGRAM_PROXY_URL)
            else:
                session = None

            cls._instance = Bot(
                token=TELEGRAM_API_TOKEN,
                default=DefaultBotProperties(parse_mode=ParseMode.HTML),
                session=session,
            )
            try:
                await cls._instance.get_me()
            except Exception:
                raise ValueError("Telegram API token not valid.")
        return cls._instance


async def send_message(
    message: str,
    parse_mode=ParseMode.HTML,
    keyboard: InlineKeyboardMarkup = None,
):
    bot = await BotManager.get_instance()
    if bot and (TELEGRAM_ADMIN_ID or TELEGRAM_LOGGER_CHANNEL_ID):
        try:
            if TELEGRAM_LOGGER_CHANNEL_ID:
                await bot.send_message(
                    TELEGRAM_LOGGER_CHANNEL_ID, message, parse_mode=parse_mode
                )
            else:
                for admin in TELEGRAM_ADMIN_ID:
                    await bot.send_message(
                        admin,
                        message,
                        parse_mode=parse_mode,
                        reply_markup=keyboard,
                    )
        except TelegramAPIError as e:
            logger.error(e)


async def send_notification(notif: Notification):
    text = create_text(notif)
    await send_message(text)
