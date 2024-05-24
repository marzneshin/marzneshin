import re

from fastapi import APIRouter
from fastapi import Header, HTTPException, Path, Request, Response
from fastapi.responses import HTMLResponse

from app.db import crud
from app.dependencies import DBDep, SubUserDep, StartDateDep, EndDateDep
from app.models.user import UserResponse
from app.templates import render_template
from app.utils.share import encode_title, generate_subscription
from config import (
    SUB_PROFILE_TITLE,
    SUB_SUPPORT_URL,
    SUB_UPDATE_INTERVAL,
    SUBSCRIPTION_PAGE_TEMPLATE,
)

router = APIRouter(prefix="/sub", tags=["Subscription"])


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
    Subscription link, V2ray and Clash supported
    """
    accept_header = request.headers.get("Accept", "")

    user: UserResponse = UserResponse.model_validate(db_user)

    if "text/html" in accept_header:
        links = generate_subscription(user=user, config_format="v2ray").split("\n")
        return HTMLResponse(
            render_template(SUBSCRIPTION_PAGE_TEMPLATE, {"user": user, "links": links})
        )

    response_headers = {
        "content-disposition": f'attachment; filename="{user.username}"',
        "profile-web-page-url": str(request.url),
        "support-url": SUB_SUPPORT_URL,
        "profile-title": encode_title(SUB_PROFILE_TITLE),
        "profile-update-interval": SUB_UPDATE_INTERVAL,
        "subscription-userinfo": "; ".join(
            f"{key}={val}"
            for key, val in get_subscription_user_info(user).items()
            if val is not None
        ),
    }

    crud.update_user_sub(db, db_user, user_agent)

    if re.match("^([Cc]lash-verge|[Cc]lash-?[Mm]eta)", user_agent):
        conf = generate_subscription(user=user, config_format="clash-meta")
        return Response(content=conf, media_type="text/yaml", headers=response_headers)
    elif re.match("^([Cc]lash|[Ss]tash)", user_agent):
        conf = generate_subscription(user=user, config_format="clash")
        return Response(content=conf, media_type="text/yaml", headers=response_headers)
    elif re.match("^(SFA|SFI|SFM|SFT)", user_agent):
        conf = generate_subscription(user=user, config_format="sing-box")
        return Response(
            content=conf, media_type="application/json", headers=response_headers
        )
    else:
        conf = generate_subscription(user=user, config_format="v2ray", as_base64=True)
        return Response(content=conf, media_type="text/plain", headers=response_headers)


@router.get("/{username}/{key}/info", response_model=UserResponse)
def user_subscription_info(db_user: SubUserDep):
    return db_user


@router.get("/{username}/{key}/usage")
def user_get_usage(
    db_user: SubUserDep, db: DBDep, start_date: StartDateDep, end_date: EndDateDep
):
    usages = crud.get_user_usages(db, db_user, start_date, end_date)

    return {"usages": usages, "username": db_user.username}


@router.get("/{username}/{key}/{client_type}")
def user_subscription_with_client_type(
    db_user: SubUserDep,
    request: Request,
    client_type: str = Path(regex="sing-box|clash-meta|clash|xray|v2ray"),
):
    """
    Subscription by client type; v2ray, xray, sing-box, clash and clash-meta formats supported
    """

    user: UserResponse = UserResponse.model_validate(db_user)

    response_headers = {
        "content-disposition": f'attachment; filename="{user.username}"',
        "profile-web-page-url": str(request.url),
        "support-url": SUB_SUPPORT_URL,
        "profile-title": encode_title(SUB_PROFILE_TITLE),
        "profile-update-interval": SUB_UPDATE_INTERVAL,
        "subscription-userinfo": "; ".join(
            f"{key}={val}"
            for key, val in get_subscription_user_info(user).items()
            if val is not None
        ),
    }

    if client_type == "clash-meta":
        conf = generate_subscription(user=user, config_format="clash-meta")
        return Response(content=conf, media_type="text/yaml", headers=response_headers)

    elif client_type == "sing-box":
        conf = generate_subscription(user=user, config_format="sing-box")
        return Response(
            content=conf, media_type="application/json", headers=response_headers
        )
    elif client_type == "clash":
        conf = generate_subscription(user=user, config_format="clash")
        return Response(content=conf, media_type="text/yaml", headers=response_headers)

    elif client_type == "v2ray":
        conf = generate_subscription(user=user, config_format="v2ray", as_base64=True)
        return Response(content=conf, media_type="text/plain", headers=response_headers)
    elif client_type == "xray":
        return Response(
            content=generate_subscription(user=user, config_format="xray"),
            headers=response_headers,
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid subscription type")
