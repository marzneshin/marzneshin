from typing import Dict
import logging

from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.exceptions import TelegramAPIError
from aiogram.types import InlineKeyboardMarkup
from aiogram import html

from app.config.env import TELEGRAM_API_TOKEN,TELEGRAM_ADMIN_ID, TELEGRAM_LOGGER_CHANNEL_ID
from app.utils.system import readable_size
from app.models.notification import Notification,UserNotif


logger = logging.getLogger(__name__)

class BotManager:
    _instance = None

    @classmethod
    async def get_instance(cls):
        if cls._instance is None:
            if TELEGRAM_API_TOKEN :
                if not await cls._check_token_validity(TELEGRAM_API_TOKEN):
                    raise ValueError("Invalid Telegram API token.")
                cls._instance = Bot(
                    token=TELEGRAM_API_TOKEN,
                    default=DefaultBotProperties(parse_mode=ParseMode.HTML)
                    )
        return cls._instance

    @staticmethod
    async def _check_token_validity(token):
        bot = Bot(token=token)
        try:
            await bot.get_me()
            return True
        except Exception:
            return False
        finally:
            await bot.session.close()

async def send_message(message: str, parse_mode=ParseMode.HTML, keyboard: InlineKeyboardMarkup=None):
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

def create_text(notif: Notification) -> str:
    
    A = UserNotif.Action
    
    _status = {
        "active": "✅ <b>#Activated</b>",
        "disabled": "❌ <b>#Disabled</b>",
        "limited": "🪫 <b>#Limited</b>",
        "expired": "🕔 <b>#Expired</b>",
    }
    
    texts : Dict[UserNotif.Action, str] = {
        A.user_created: "🆕 <b>#Created</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username :</b> <code>{username}</code>\n<b>Traffic Limit :</b> <code>{data_limit}</code>\n<b>Expire Date :</b> <code>{expire_date}</code>\n<b>Services :</b> <code>{services}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By :</b> <b>#{by}</b>",
        A.user_updated: "✏️ <b>#Modified</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username :</b> <code>{username}</code>\n<b>Traffic Limit :</b> <code>{data_limit}</code>\n<b>Expire Date :</b> <code>{expire_date}</code>\n<b>Services :</b> <code>{services}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By :</b> <b>#{by}</b>",
        A.user_deleted: "🗑 <b>#Deleted</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By</b> : <b>#{by}</b>",
        A.user_enabled : "{status}\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>",
        A.user_disabled : "{status}\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>",
        A.data_usage_reset : "🔁 <b>#Reset</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By</b> : <b>#{by}</b>",
        A.subscription_revoked : "🔁 <b>#Revoked</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By</b> : <b>#{by}</b>",
        A.reached_usage_percent : "⚠️<b>#DataLimitWarning</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Used Percent</b> : <code>{usage_percent}</code>\n<b>Remaining Traffic</b> : <code>{remaining_traffic}</code>",
        A.reached_days_left : "⚠️<b>#ExpirationWarning</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Remaining Days</b> : <code>{remaining_days}</code>"
    }
    
    text = texts.get(notif.action)
    
    status = getattr(notif, 'user_status', None)
    
    data = {
        'username': html.quote(notif.user.username),
        'data_limit': readable_size(notif.user.data_limit) if notif.user.data_limit else 'Unlimited',
        'remaining_traffic' : readable_size(notif.user.data_limit-notif.user.used_traffic) if notif.user.data_limit else 'Unlimited',
        'usage_percent' : getattr(notif,'used_percent',None),
        'expire_date': notif.user.expire_date.strftime("%H:%M:%S %Y-%m-%d") if notif.user.expire_date else 'Never',
        'remaining_days' : getattr(notif,'days_left',None),
        'status' : _status.get(status.value if status else None,None),
        'services': "" if not notif.user.service_ids else ", ".join([str(s) for s in notif.user.service_ids]),
        'by': html.quote(notif.by.username),
    }

    formatted_message = text.format_map(data)
    
    return formatted_message


async def send_notification(notif: Notification):
    text = create_text(notif)
    await send_message(text)