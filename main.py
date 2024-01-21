import asyncio

from app import app
from config import (
    DEBUG,
    UVICORN_HOST,
    UVICORN_PORT,
    UVICORN_UDS,
    UVICORN_SSL_CERTFILE,
    UVICORN_SSL_KEYFILE
)
from uvicorn import Config, Server

import logging

if __name__ == "__main__":
    # Do NOT change workers count for now
    # multi-workers support isn't implemented yet for APScheduler and XRay module
    loop = asyncio.new_event_loop()
    try:
        cfg = Config(
            app = app,
            host=('0.0.0.0' if DEBUG else UVICORN_HOST),
            port=UVICORN_PORT,
            uds=(None if DEBUG else UVICORN_UDS),
            ssl_certfile=UVICORN_SSL_CERTFILE,
            ssl_keyfile=UVICORN_SSL_KEYFILE,
            workers=1,
            reload=DEBUG,
            log_level=logging.DEBUG if DEBUG else logging.INFO,
            loop=loop
        )
        server = Server(cfg)
        loop.run_until_complete(server.serve())
    except FileNotFoundError:  # to prevent error on removing unix sock
        pass
