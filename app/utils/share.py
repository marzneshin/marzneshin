import base64
import json
import random
import secrets
from datetime import datetime as dt, timedelta
from typing import TYPE_CHECKING, Literal, Union, List
from uuid import UUID

from jdatetime import date as jd
from v2share import V2Data, SingBoxConfig, ClashConfig, ClashMetaConfig, XrayConfig
from v2share.links import LinksConfig

from app.db import GetDB, crud
from app.models.proxy import (
    InboundHostSecurity,
)
from app.utils.keygen import gen_uuid, gen_password
from app.utils.system import get_public_ip, readable_size
from app.models.user import UserStatus

if TYPE_CHECKING:
    from app.models.user import UserResponse

SERVER_IP = get_public_ip()

STATUS_EMOJIS = {
    "active": "✅",
    "expired": "⌛️",
    "limited": "🪫",
    "disabled": "❌",
    "on_hold": "🔌",
}

subscription_handlers = {
    "v2ray": LinksConfig,
    "xray": XrayConfig,
    "clash-meta": ClashMetaConfig,
    "clash": ClashConfig,
    "sing-box": SingBoxConfig,
}


def generate_subscription(
    user: "UserResponse",
    config_format: Literal["v2ray", "xray", "clash-meta", "clash", "sing-box"],
    as_base64: bool = False,
) -> str:

    inbounds = user.inbounds
    key = user.key
    extra_data = user.model_dump(exclude={"subscription_url", "services", "inbounds"})
    format_variables = setup_format_variables(extra_data)

    if config_format not in subscription_handlers.keys():
        raise ValueError(f'Unsupported format "{config_format}"')

    config = process_inbounds_and_tags(
        inbounds, key, format_variables, conf=subscription_handlers[config_format]()
    )

    return config if not as_base64 else base64.b64encode(config.encode()).decode()


def format_time_left(seconds_left: int) -> str:
    if not seconds_left or seconds_left <= 0:
        return "∞"

    minutes, seconds = divmod(seconds_left, 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    months, days = divmod(days, 30)

    result = []
    if months:
        result.append(f"{months}m")
    if days:
        result.append(f"{days}d")
    if hours and (days < 7):
        result.append(f"{hours}h")
    if minutes and not (months or days):
        result.append(f"{minutes}m")
    if seconds and not (months or days):
        result.append(f"{seconds}s")
    return " ".join(result)


def setup_format_variables(extra_data: dict) -> dict:

    user_status = extra_data.get("status")
    expire_datetime = extra_data.get("expire")
    on_hold_expire_duration = extra_data.get("on_hold_expire_duration")

    if user_status != UserStatus.on_hold:
        if expire_datetime is not None:
            seconds_left = (expire_datetime - dt.utcnow()).total_seconds()
            expire_date = expire_datetime.date()
            jalali_expire_date = jd.fromgregorian(
                year=expire_date.year, month=expire_date.month, day=expire_date.day
            ).strftime("%Y-%m-%d")
            days_left = (expire_datetime - dt.utcnow()).days + 1
            time_left = format_time_left(seconds_left)
        else:
            days_left = "∞"
            time_left = "∞"
            expire_date = "∞"
            jalali_expire_date = "∞"
    else:
        if on_hold_expire_duration is not None and on_hold_expire_duration >= 0:
            days_left = timedelta(seconds=on_hold_expire_duration).days
            time_left = format_time_left(on_hold_expire_duration)
            expire_date = "-"
            jalali_expire_date = "-"
        else:
            days_left = "∞"
            time_left = "∞"
            expire_date = "∞"
            jalali_expire_date = "∞"

    if extra_data.get("data_limit"):
        data_limit = readable_size(extra_data["data_limit"])
        data_left = extra_data["data_limit"] - extra_data["used_traffic"]
        if data_left < 0:
            data_left = 0
        data_left = readable_size(data_left)
    else:
        data_limit = "∞"
        data_left = "∞"

    status_emoji = STATUS_EMOJIS.get(extra_data.get("status")) or ""

    format_variables = {
        "SERVER_IP": SERVER_IP,
        "USERNAME": extra_data.get("username", "{USERNAME}"),
        "DATA_USAGE": readable_size(extra_data.get("used_traffic")),
        "DATA_LIMIT": data_limit,
        "DATA_LEFT": data_left,
        "DAYS_LEFT": days_left,
        "EXPIRE_DATE": expire_date,
        "JALALI_EXPIRE_DATE": jalali_expire_date,
        "TIME_LEFT": time_left,
        "STATUS_EMOJI": status_emoji,
    }

    return format_variables


def process_inbounds_and_tags(
    inbounds: list,
    key: str,
    format_variables: dict,
    conf=None,
) -> Union[List, str]:
    salt = secrets.token_hex(8)

    for inb in inbounds:
        inb_id, inbound, protocol, tag = (
            inb.id,
            json.loads(inb.config),
            inb.protocol,
            inb.tag,
        )

        format_variables.update({"PROTOCOL": protocol.name})
        if not inbound:
            continue

        format_variables.update({"TRANSPORT": inbound["network"]})
        with GetDB() as db:
            hosts = crud.get_inbound_hosts(db, inb_id)

        for host in hosts:
            host_snis = host.sni.split(",") if host.sni else []
            sni_list = host_snis or inbound["sni"]
            if sni_list:
                sni = random.choice(sni_list).replace("*", salt)
            else:
                sni = ""

            host_hosts = host.host.split(",") if host.host else []
            req_host_list = host_hosts or inbound["host"]
            if req_host_list:
                req_host = random.choice(req_host_list).replace("*", salt)
            else:
                req_host = ""

            host_tls = (
                None
                if host.security == InboundHostSecurity.inbound_default
                else host.security.value
            )
            data = V2Data(
                protocol.value,
                host.remark.format_map(format_variables),
                host.address.format_map(format_variables),
                host.port or inbound["port"],
                transport_type=inbound["network"],
                sni=sni,
                host=req_host,
                tls=host_tls or inbound["tls"],
                alpn=host.alpn.value or inbound.get("alpn", ""),
                path=(
                    host.path.format_map(format_variables)
                    if host.path
                    else inbound.get("path", "")
                ),
                fingerprint=host.fingerprint.value,
                allow_insecure=host.allowinsecure,
                uuid=UUID(gen_uuid(key)),
                password=gen_password(key),
            )
            conf.add_proxies([data])
    return conf.render()


def encode_title(text: str) -> str:
    return f"base64:{base64.b64encode(text.encode()).decode()}"
