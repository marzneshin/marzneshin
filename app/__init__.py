import logging

import uvicorn

from app.config import env

__version__ = "0.1.0"

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG if env.DEBUG else logging.INFO)
handler = logging.StreamHandler()
formatter = uvicorn.logging.ColourizedFormatter(
    "{levelprefix:<8} @{name}: {message}", style="{", use_colors=True
)
handler.setFormatter(formatter)
logger.addHandler(handler)
