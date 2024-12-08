import logging
import aiohttp
from fastapi.encoders import jsonable_encoder

from app.models.notification import Notification
from app.config.env import WEBHOOK_ADDRESS, WEBHOOK_SECRET

logger = logging.getLogger(__name__)

headers = {"x-webhook-secret": WEBHOOK_SECRET} if WEBHOOK_SECRET else None


async def send_notification(notif: Notification) -> bool:
    """Send the notification to the webhook address provided by WEBHOOK_ADDRESS

    Args:
       notif (Notification): A single notification object to be sent.

    Returns:
        bool: returns True if an ok response received
    """

    result = await send_req(
        w_address=WEBHOOK_ADDRESS, data=jsonable_encoder(notif)
    )
    return result


async def send_req(w_address: str, data):
    try:
        logger.debug(f"Sending {len(data)} webhook updates to {w_address}")
        async with aiohttp.ClientSession() as session:
            async with session.post(
                w_address, json=data, headers=headers
            ) as r:
                if r.status == 200:
                    return True
                logger.error(
                    f"Failed to send data to {w_address}: {r.status} {await r.text()}"
                )
    except Exception as err:
        logger.error(err)
    return False
