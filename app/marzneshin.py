import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi_pagination import add_pagination
from starlette.staticfiles import StaticFiles
from uvicorn import Config, Server

from app.config.env import (
    DEBUG,
    DOCS,
    HOME_PAGE_TEMPLATE,
    UVICORN_HOST,
    UVICORN_PORT,
    UVICORN_SSL_CERTFILE,
    UVICORN_SSL_KEYFILE,
    UVICORN_UDS,
    DASHBOARD_PATH,
    TASKS_RECORD_USER_USAGES_INTERVAL,
    TASKS_REVIEW_USERS_INTERVAL,
    TASKS_EXPIRE_DAYS_REACHED_INTERVAL,
    TASKS_RESET_USER_DATA_USAGE,
)
from app.templates import render_template
from . import __version__
from .routes import api_router
from .tasks import (
    nodes_startup,
    record_user_usages,
    reset_user_data_usage,
    review_users,
    expire_days_reached,
)
from .webhooks import webhooks_router

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await nodes_startup()
    yield
    scheduler.shutdown()


app = FastAPI(
    title="MarzneshinAPI",
    description="Unified GUI Censorship Resistant Solution Powered by Xray",
    version=__version__,
    lifespan=lifespan,
    docs_url="/docs" if DOCS else None,
    redoc_url="/redoc" if DOCS else None,
)

app.webhooks.include_router(webhooks_router)

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
scheduler.add_job(
    record_user_usages,
    "interval",
    coalesce=True,
    seconds=TASKS_RECORD_USER_USAGES_INTERVAL,
)
scheduler.add_job(
    review_users,
    "interval",
    seconds=TASKS_REVIEW_USERS_INTERVAL,
    coalesce=True,
    max_instances=1,
)
scheduler.add_job(
    expire_days_reached,
    "interval",
    seconds=TASKS_EXPIRE_DAYS_REACHED_INTERVAL,
    coalesce=True,
    max_instances=1,
)
scheduler.add_job(
    reset_user_data_usage,
    "interval",
    seconds=TASKS_RESET_USER_DATA_USAGE,
    coalesce=True,
)


@app.exception_handler(RequestValidationError)
def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
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
