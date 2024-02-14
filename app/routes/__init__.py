from fastapi import APIRouter

from . import admin, node, service, inbounds, subscription, system, user

api_router = APIRouter(prefix="/api")

api_router.include_router(admin.router)
api_router.include_router(node.router)
api_router.include_router(service.router)
api_router.include_router(inbounds.router)
api_router.include_router(subscription.router)
api_router.include_router(system.router)
api_router.include_router(user.router)

__all__ = [
    "api_router"
]
