import asyncio
import logging
from datetime import datetime as dt
from datetime import timedelta as td

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi_pagination import add_pagination
from starlette.staticfiles import StaticFiles
from uvicorn import Config, Server

import config
from app.templates import render_template
from config import (
    DEBUG,
    DOCS,
    HOME_PAGE_TEMPLATE,
    UVICORN_HOST,
    UVICORN_PORT,
    UVICORN_SSL_CERTFILE,
    UVICORN_SSL_KEYFILE,
    UVICORN_UDS,
    DASHBOARD_PATH,
)

from . import __version__, telegram
from .routes import api_router
from .tasks import (
    delete_expired_reminders,
    nodes_startup,
    record_realtime_bandwidth,
    record_user_usages,
    reset_user_data_usage,
    review_users,
    send_notifications,
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="MarzneshinAPI",
    description="Unified GUI Censorship Resistant Solution Powered by Xray",
    version=__version__,
    docs_url="/docs" if DOCS else None,
    redoc_url="/redoc" if DOCS else None,
)

app.include_router(api_router)
add_pagination(app)


@app.get("/", response_class=HTMLResponse)
def home_page():
    return render_template(HOME_PAGE_TEMPLATE)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scheduler = AsyncIOScheduler(timezone="UTC")
scheduler.add_job(record_user_usages, "interval", coalesce=True, seconds=30)
scheduler.add_job(review_users, "interval", seconds=600, coalesce=True, max_instances=1)
scheduler.add_job(reset_user_data_usage, "interval", coalesce=True, hours=1)
scheduler.add_job(
    record_realtime_bandwidth, "interval", seconds=1, coalesce=True, max_instances=1
)

if config.WEBHOOK_ADDRESS:
    scheduler.add_job(send_notifications, "interval", seconds=30, replace_existing=True)
    scheduler.add_job(
        delete_expired_reminders,
        "interval",
        hours=2,
        start_date=dt.utcnow() + td(minutes=1),
    )


@app.on_event("startup")
async def on_start():
    await nodes_startup()


@app.on_event("shutdown")
async def on_shutdown():
    scheduler.shutdown()
    logger.info("Sending pending notifications before shutdown...")
    await send_notifications()


@app.exception_handler(RequestValidationError)
def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = {}
    for error in exc.errors():
        details[error["loc"][-1]] = error.get("msg")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": details}),
    )


async def main():
    if not DEBUG:
        app.mount(
            DASHBOARD_PATH,
            StaticFiles(directory="dashboard/dist", html=True),
            name="dashboard",
        )
        app.mount(
            "/static/",
            StaticFiles(directory="dashboard/dist/static"),
            name="static",
        )
        app.mount(
            "/locales/",
            StaticFiles(directory="dashboard/dist/locales"),
            name="locales",
        )
    scheduler.start()
    asyncio.create_task(telegram.start_bot())
    cfg = Config(
        app=app,
        host=UVICORN_HOST,
        port=UVICORN_PORT,
        uds=(None if DEBUG else UVICORN_UDS),
        ssl_certfile=UVICORN_SSL_CERTFILE,
        ssl_keyfile=UVICORN_SSL_KEYFILE,
        workers=1,
        reload=DEBUG,
        log_level=logging.DEBUG if DEBUG else logging.INFO,
    )
    server = Server(cfg)
    await server.serve()
