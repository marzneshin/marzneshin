import logging
from datetime import datetime

from telebot.apihelper import ApiTelegramException
from telebot.formatting import escape_html

from app import telegram
from app.utils.system import readable_size
from config import TELEGRAM_ADMIN_ID, TELEGRAM_LOGGER_CHANNEL_ID

logger = logging.getLogger(__name__)


async def report(message: str, parse_mode="html", keyboard=None):
    if telegram.bot and (TELEGRAM_ADMIN_ID or TELEGRAM_LOGGER_CHANNEL_ID):
        try:
            if TELEGRAM_LOGGER_CHANNEL_ID:
                await telegram.bot.send_message(
                    TELEGRAM_LOGGER_CHANNEL_ID, message, parse_mode=parse_mode
                )
            else:
                for admin in TELEGRAM_ADMIN_ID:
                    await telegram.bot.send_message(
                        admin,
                        message,
                        parse_mode=parse_mode,
                        reply_markup=keyboard,
                    )
        except ApiTelegramException as e:
            logger.error(e)


async def report_new_user(
    user_id: int,
    username: str,
    by: str,
    expire_date: datetime,
    data_limit: int,
    services: list,
):
    text = """\
🆕 <b>#Created</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{username}</code>
<b>Traffic Limit :</b> <code>{data_limit}</code>
<b>Expire Date :</b> <code>{expire_date}</code>
<b>Services :</b> <code>{services}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <b>#{by}</b>""".format(
        by=escape_html(by),
        username=escape_html(username),
        data_limit=readable_size(data_limit) if data_limit else "Unlimited",
        expire_date=(
            expire_date.strftime("%H:%M:%S %Y-%m-%d")
            if expire_date
            else "Never"
        ),
        services="" if not services else ", ".join([s.name for s in services]),
    )

    return await report(text)


async def report_user_modification(
    username: str,
    expire_date: datetime,
    data_limit: int,
    services: list,
    by: str,
):
    text = """\
✏️ <b>#Modified</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{username}</code>
<b>Traffic Limit :</b> <code>{data_limit}</code>
<b>Expire Date :</b> <code>{expire_date}</code>
<b>Services :</b> <code>{services}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <b>#{by}</b>\
    """.format(
        by=escape_html(by),
        username=escape_html(username),
        data_limit=readable_size(data_limit) if data_limit else "Unlimited",
        expire_date=(
            expire_date.strftime("%H:%M:%S %Y-%m-%d")
            if expire_date
            else "Never"
        ),
        services=", ".join([s.name for s in services]),
    )

    return await report(text)


async def report_user_deletion(username: str, by: str):
    text = """\
🗑 <b>#Deleted</b>
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By</b> : <b>#{by}</b>\
    """.format(
        by=escape_html(by), username=escape_html(username)
    )
    return await report(text)


async def report_status_change(username: str, status: str):
    _status = {
        "active": "✅ <b>#Activated</b>",
        "on_hold": "🟡 <b>#On_Hold</b>",
        "limited": "🪫 <b>#Limited</b>",
        "expired": "🕔 <b>#Expired</b>",
    }
    text = """\
{status}
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>\
    """.format(
        username=escape_html(username), status=_status[status]
    )
    return await report(text)


async def report_user_usage_reset(username: str, by: str):
    text = """  
🔁 <b>#Reset</b>
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By</b> : <b>#{by}</b>\
    """.format(
        by=escape_html(by), username=escape_html(username)
    )

    return await report(text)


async def report_user_subscription_revoked(username: str, by: str):
    text = """  
🔁 <b>#Revoked</b>
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By</b> : <b>#{by}</b>\
    """.format(
        by=escape_html(by), username=escape_html(username)
    )

    return await report(text)
