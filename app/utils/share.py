import base64
import json
import random
import secrets
from datetime import datetime as dt, timedelta
from typing import TYPE_CHECKING, Literal, Union, List
from uuid import UUID

from jdatetime import date as jd
from v2share import V2Data, SingBoxConfig, ClashConfig, ClashMetaConfig

from app.db import GetDB, crud
from app.models.proxy import (
    InboundHostSecurity,
)
from app.utils.keygen import generate_settings, gen_uuid, gen_password
from app.utils.system import get_public_ip, readable_size

if TYPE_CHECKING:
    from app.models.user import UserResponse

SERVER_IP = get_public_ip()

STATUS_EMOJIS = {
    "active": "✅",
    "expired": "⌛️",
    "limited": "🪫",
    "disabled": "❌",
    "connect_to_start": "🔌",
}


def generate_v2ray_links(inbounds: list, key: str, extra_data: dict) -> list:
    format_variables = setup_format_variables(extra_data)
    return process_inbounds_and_tags(inbounds, key, format_variables, mode="v2ray")


def generate_clash_subscription(
    inbounds: list, key: str, extra_data: dict, is_meta: bool = False
) -> str:
    if is_meta is True:
        conf = ClashMetaConfig()
    else:
        conf = ClashConfig()

    format_variables = setup_format_variables(extra_data)
    return process_inbounds_and_tags(
        inbounds, key, format_variables, mode="clash", conf=conf
    )


def generate_singbox_subscription(inbounds: list, key: str, extra_data: dict) -> str:
    conf = SingBoxConfig()

    format_variables = setup_format_variables(extra_data)
    return process_inbounds_and_tags(
        inbounds, key, format_variables, mode="sing-box", conf=conf
    )


def generate_v2ray_subscription(links: list) -> str:
    return base64.b64encode("\n".join(links).encode()).decode()


def generate_subscription(
    user: "UserResponse",
    config_format: Literal["v2ray", "clash-meta", "clash", "sing-box"],
    as_base64: bool,
) -> str:
    kwargs = {
        # "proxies": user.proxies,
        "inbounds": user.inbounds,
        "key": user.key,
        "extra_data": user.__dict__,
    }

    if config_format == "v2ray":
        config = "\n".join(generate_v2ray_links(**kwargs))
    elif config_format == "clash-meta":
        config = generate_clash_subscription(**kwargs, is_meta=True)
    elif config_format == "clash":
        config = generate_clash_subscription(**kwargs)
    elif config_format == "sing-box":
        config = generate_singbox_subscription(**kwargs)
    else:
        raise ValueError(f'Unsupported format "{config_format}"')

    if as_base64:
        config = base64.b64encode(config.encode()).decode()

    return config


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


from app.models.user import UserStatus


def setup_format_variables(extra_data: dict) -> dict:

    user_status = extra_data.get("status")
    expire_timestamp = extra_data.get("expire")
    on_hold_expire_duration = extra_data.get("on_hold_expire_duration")

    if user_status != UserStatus.on_hold:
        if expire_timestamp is not None and expire_timestamp >= 0:
            seconds_left = expire_timestamp - int(dt.utcnow().timestamp())
            expire_datetime = dt.fromtimestamp(expire_timestamp)
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
    ukey: str,
    format_variables: dict,
    mode: str = "v2ray",
    conf=None,
) -> Union[List, str]:
    salt = secrets.token_hex(8)
    results = []

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
                uuid=UUID(gen_uuid(ukey)),
                password=gen_password(ukey),
            )
            if mode == "v2ray":
                results.append(data.to_link())
            elif mode in ["clash", "sing-box"]:
                conf.add_proxies([data])

    if mode in ["clash", "sing-box"]:
        return conf.render()
    return results


def encode_title(text: str) -> str:
    return f"base64:{base64.b64encode(text.encode()).decode()}"
