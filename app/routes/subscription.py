import re
from collections import defaultdict

from fastapi import APIRouter
from fastapi import Header, HTTPException, Path, Request, Response
from fastapi.responses import HTMLResponse

from app.config.env import (
    SUBSCRIPTION_PAGE_TEMPLATE,
)
from app.db import crud
from app.db.models import Settings
from app.dependencies import DBDep, SubUserDep, StartDateDep, EndDateDep
from app.models.settings import SubscriptionSettings
from app.models.user import UserResponse
from app.templates import render_template
from app.utils.share import encode_title, generate_subscription

router = APIRouter(prefix="/sub", tags=["Subscription"])


config_mimetype = defaultdict(
    lambda: "text/plain",
    {
        "links": "text/plain",
        "base64-links": "text/plain",
        "sing-box": "application/json",
        "xray": "application/json",
        "clash": "text/yaml",
        "clash-meta": "text/yaml",
        "template": "text/html",
        "block": "text/plain",
    },
)


def get_subscription_user_info(user: UserResponse) -> dict:
    return {
        "upload": 0,
        "download": user.used_traffic,
        "total": user.data_limit,
        "expire": user.expire,
    }


@router.get("/{username}/{key}")
def user_subscription(
    db_user: SubUserDep,
    request: Request,
    db: DBDep,
    user_agent: str = Header(default=""),
):
    """
    Subscription link, result format depends on subscription settings
    """

    user: UserResponse = UserResponse.model_validate(db_user)

    crud.update_user_sub(db, db_user, user_agent)

    subscription_settings = SubscriptionSettings.model_validate(
        db.query(Settings.subscription).first()[0]
    )

    if (
        subscription_settings.template_on_acceptance
        and "text/html" in request.headers.get("Accept", [])
    ):
        links = generate_subscription(
            user=db_user, config_format="links"
        ).split()
        return HTMLResponse(
            render_template(
                SUBSCRIPTION_PAGE_TEMPLATE,
                {"user": user, "links": links},
            )
        )

    response_headers = {
        "content-disposition": f'attachment; filename="{user.username}"',
        "profile-web-page-url": str(request.url),
        "support-url": subscription_settings.support_link,
        "profile-title": encode_title(subscription_settings.profile_title),
        "profile-update-interval": str(subscription_settings.update_interval),
        "subscription-userinfo": "; ".join(
            f"{key}={val}"
            for key, val in get_subscription_user_info(user).items()
            if val is not None
        ),
    }

    for rule in subscription_settings.rules:
        if re.match(rule.pattern, user_agent):
            if rule.result.value == "template":
                links = generate_subscription(
                    user=db_user, config_format="links"
                ).split()
                return HTMLResponse(
                    render_template(
                        SUBSCRIPTION_PAGE_TEMPLATE,
                        {"user": user, "links": links},
                    )
                )
            elif rule.result.value == "block":
                raise HTTPException(404)
            elif rule.result.value == "base64-links":
                b64 = True
                config_format = "links"
            else:
                b64 = False
                config_format = rule.result.value

            conf = generate_subscription(
                user=db_user,
                config_format=config_format,
                as_base64=b64,
            )
            return Response(
                content=conf,
                media_type=config_mimetype[rule.result],
                headers=response_headers,
            )


@router.get("/{username}/{key}/info", response_model=UserResponse)
def user_subscription_info(db_user: SubUserDep):
    return db_user


@router.get("/{username}/{key}/usage")
def user_get_usage(
    db_user: SubUserDep,
    db: DBDep,
    start_date: StartDateDep,
    end_date: EndDateDep,
):
    usages = crud.get_user_usages(db, db_user, start_date, end_date)

    return {"usages": usages, "username": db_user.username}


@router.get("/{username}/{key}/{client_type}")
def user_subscription_with_client_type(
    db: DBDep,
    db_user: SubUserDep,
    request: Request,
    client_type: str = Path(regex="sing-box|clash-meta|clash|xray|v2ray"),
):
    """
    Subscription by client type; v2ray, xray, sing-box, clash and clash-meta formats supported
    """

    user: UserResponse = UserResponse.model_validate(db_user)

    subscription_settings = SubscriptionSettings.model_validate(
        db.query(Settings.subscription).first()[0]
    )

    response_headers = {
        "content-disposition": f'attachment; filename="{user.username}"',
        "profile-web-page-url": str(request.url),
        "support-url": subscription_settings.support_link,
        "profile-title": encode_title(subscription_settings.profile_title),
        "profile-update-interval": subscription_settings.update_interval,
        "subscription-userinfo": "; ".join(
            f"{key}={val}"
            for key, val in get_subscription_user_info(user).items()
            if val is not None
        ),
    }

    if client_type == "clash-meta":
        conf = generate_subscription(user=db_user, config_format="clash-meta")
        return Response(
            content=conf, media_type="text/yaml", headers=response_headers
        )

    elif client_type == "sing-box":
        conf = generate_subscription(user=db_user, config_format="sing-box")
        return Response(
            content=conf,
            media_type="application/json",
            headers=response_headers,
        )
    elif client_type == "clash":
        conf = generate_subscription(user=db_user, config_format="clash")
        return Response(
            content=conf, media_type="text/yaml", headers=response_headers
        )

    elif client_type == "v2ray":
        conf = generate_subscription(
            user=db_user, config_format="links", as_base64=True
        )
        return Response(
            content=conf, media_type="text/plain", headers=response_headers
        )
    elif client_type == "xray":
        return Response(
            content=generate_subscription(user=db_user, config_format="xray"),
            media_type="application/json",
            headers=response_headers,
        )
    else:
        raise HTTPException(
            status_code=400, detail="Invalid subscription type"
        )
