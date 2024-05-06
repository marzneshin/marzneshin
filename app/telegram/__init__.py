from telebot import asyncio_helper
from telebot.async_telebot import AsyncTeleBot

from config import TELEGRAM_API_TOKEN, TELEGRAM_PROXY_URL
from app.telegram.report import (
    report,
    report_new_user,
    report_user_modification,
    report_user_deletion,
    report_status_change,
    report_user_usage_reset,
    report_user_subscription_revoked,
)

bot = None
if TELEGRAM_API_TOKEN:
    asyncio_helper.proxy = TELEGRAM_PROXY_URL
    bot = AsyncTeleBot(TELEGRAM_API_TOKEN)


async def start_bot():
    if bot:
        await bot.polling()


__all__ = [
    "bot",
    "report",
    "report_new_user",
    "report_user_modification",
    "report_user_deletion",
    "report_status_change",
    "report_user_usage_reset",
    "report_user_subscription_revoked",
]
