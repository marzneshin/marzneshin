from typing import Dict, Optional
from app.models.notification import Notification, UserNotif
from app.models.user import UserResponse
from app.models.admin import Admin
from app.utils.system import readable_size
from aiogram import html
from enum import Enum

from datetime import datetime


class UserStatus(Enum):
    ACTIVATED = "activated"
    DISABLED = "disabled"
    LIMITED = "limited"
    EXPIRED = "expired"


def create_text(notif: Notification) -> str:

    data = prepare_data(notif)
    A = UserNotif.Action

    texts: Dict[UserNotif.Action, str] = {
        A.user_created: "🆕 <b>#Created</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username :</b> <code>{username}</code>\n<b>Traffic Limit :</b> <code>{data_limit}</code>\n<b>Expire Date :</b> <code>{expire_date}</code>\n<b>Services :</b> <code>{services}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>\n<b>By :</b> <b>#{by}</b>",
        A.user_updated: "✏️ <b>#Modified</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username :</b> <code>{username}</code>\n<b>Traffic Limit :</b> <code>{data_limit}</code>\n<b>Expire Date :</b> <code>{expire_date}</code>\n<b>Services :</b> <code>{services}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>\n<b>By :</b> <b>#{by}</b>",
        A.user_activated: "✅ <b>#Activated</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Belongs To :</b> <code>{owner_username}</code>",
        A.user_deleted: "🗑 <b>#Deleted</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>\n<b>By :</b> <b>#{by}</b>",
        A.user_enabled: "☑️ <b>#Enabled</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>\n<b>By :</b> <b>#{by}</b>",
        A.user_disabled: "",
        A.data_usage_reset: "🔁 <b>#Reset</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By</b> : <b>#{by}</b>",
        A.subscription_revoked: "🔁 <b>#Revoked</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>By</b> : <b>#{by}</b>",
        A.reached_usage_percent: "⚠️<b>#DataLimitWarning</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Used Percent</b> : <code>{usage_percent}</code>\n<b>Remaining Traffic</b> : <code>{remaining_traffic}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>",
        A.reached_days_left: "⚠️<b>#ExpirationWarning</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Remaining Days</b> : <code>{remaining_days}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>",
    }

    if notif.action == A.user_disabled:
        if data["status"] == UserStatus.DISABLED and not notif.user.enabled:
            texts[A.user_disabled] = (
                "❌ <b>#Disabled</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n➖➖➖➖➖➖➖➖➖\n<b>Belongs To :</b> <code>{owner_username}</code>\n<b>By :</b> <b>#{by}</b>"
            )
        elif data["status"] == UserStatus.DISABLED:
            texts[A.user_disabled] = (
                "❌ <b>#Deactivated</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>"
            )
        elif data["status"] == UserStatus.LIMITED:
            texts[A.user_disabled] = (
                "🪫 <b>#Limited</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Belongs To :</b> <code>{owner_username}</code>"
            )
        elif data["status"] == UserStatus.EXPIRED:
            texts[A.user_disabled] = (
                "🕔 <b>#Expired</b>\n➖➖➖➖➖➖➖➖➖\n<b>Username</b> : <code>{username}</code>\n<b>Belongs To :</b> <code>{owner_username}</code>"
            )

    text = texts.get(notif.action)
    formatted_message = text.format_map(data)

    return formatted_message


def prepare_data(notif: Notification) -> dict:
    user = UserResponse.model_validate(notif.user)
    by: Optional[Admin] = (
        Admin.model_validate(notif.by)
        if hasattr(notif, "by") and notif.by
        else None
    )

    data = {
        "username": html.quote(user.username),
        "status": set_status(user, by),
        "data_limit": (
            readable_size(user.data_limit) if user.data_limit else "Unlimited"
        ),
        "remaining_traffic": (
            readable_size(max(user.data_limit - user.used_traffic, 0))
            if user.data_limit
            else "Unlimited"
        ),
        "usage_percent": (
            f"{round(min((user.used_traffic / user.data_limit) * 100, 100))}%"
            if user.data_limit > 0
            else "0%"
        ),
        "expire_date": (
            user.expire_date.strftime("%H:%M:%S %Y-%m-%d")
            if user.expire_date
            else "Never"
        ),
        "remaining_days": (
            (user.expire_date - datetime.now()).days
            if user.expire_date
            else "Never"
        ),
        "services": (
            ""
            if not user.service_ids
            else ", ".join([str(s) for s in user.service_ids])
        ),
        "owner_username": user.owner_username,
        "by": html.quote(by.username) if by else None,
    }

    return data


def set_status(user: UserResponse, by: Admin):
    if user.is_active:
        return UserStatus.ACTIVATED
    elif not user.enabled or by:
        return UserStatus.DISABLED
    elif user.expired:
        return UserStatus.EXPIRED
    elif user.data_limit_reached:
        return UserStatus.LIMITED
