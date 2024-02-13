import asyncio
import atexit
import logging
import os
from datetime import datetime as dt
from datetime import timedelta as td

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from starlette.staticfiles import StaticFiles
from uvicorn import Server, Config

import config
from app.templates import render_template
from config import DOCS, DEBUG, UVICORN_SSL_KEYFILE, UVICORN_SSL_CERTFILE, UVICORN_UDS, UVICORN_PORT, UVICORN_HOST
from config import HOME_PAGE_TEMPLATE
from . import __version__, telegram
from .dashboard import build_dir, build, base_dir
from .tasks import record_user_usages, review_users, reset_user_data_usage, nodes_health_check, \
    record_realtime_bandwidth, send_notifications, delete_expired_reminders, nodes_startup
from .routes import admin, node, service, subscription, system, user

logger = logging.getLogger(__name__)
dashboard_path = "/dashboard/"

app = FastAPI(
    title="MarzneshinAPI",
    description="Unified GUI Censorship Resistant Solution Powered by Xray",
    version=__version__,
    docs_url="/docs" if DOCS else None,
    redoc_url="/redoc" if DOCS else None,
)

app.include_router(admin.router)
app.include_router(node.router)
app.include_router(service.router)
app.include_router(subscription.router)
app.include_router(system.router)
app.include_router(user.router)


@app.get("/", response_class=HTMLResponse)
def home():
    return render_template(HOME_PAGE_TEMPLATE)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scheduler = AsyncIOScheduler(timezone="UTC")
scheduler.add_job(record_user_usages, 'interval', coalesce=True, seconds=30)
scheduler.add_job(review_users, 'interval', seconds=600, coalesce=True, max_instances=1)
scheduler.add_job(reset_user_data_usage, 'interval', coalesce=True, hours=1)
scheduler.add_job(nodes_health_check, 'interval', seconds=5, coalesce=True, max_instances=1)
scheduler.add_job(record_realtime_bandwidth, 'interval', seconds=1, coalesce=True, max_instances=1)

if config.WEBHOOK_ADDRESS:
    scheduler.add_job(send_notifications, "interval", seconds=30, replace_existing=True)
    scheduler.add_job(delete_expired_reminders, "interval", hours=2, start_date=dt.utcnow() + td(minutes=1))


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
    if DEBUG:
        proc = await asyncio.create_subprocess_exec(
            'npm',
            'run', 'dev', '--', '--host', '0.0.0.0', '--base',
            dashboard_path, '--clearScreen', 'false',
            env={**os.environ, 'VITE_BASE_API': config.VITE_BASE_API},
            cwd=base_dir
        )
        atexit.register(proc.terminate)
    else:
        if not build_dir.is_dir():
            build()

        app.mount(
            "/dashboard/",
            StaticFiles(directory=build_dir, html=True),
            name="dashboard"
        )
    scheduler.start()
    asyncio.create_task(telegram.start_bot())
    await nodes_startup()
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
