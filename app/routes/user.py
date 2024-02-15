import asyncio
import logging
from datetime import datetime, timezone
from typing import List

import sqlalchemy
from fastapi import APIRouter
from fastapi import HTTPException, Query

from app import marznode
from app.db import crud
from app.dependencies import DBDep, AdminDep, SudoAdminDep, UserDep, StartDateDep, EndDateDep
from app.models.user import (UserCreate, UserModify, UserResponse,
                             UsersResponse, UserStatus, UserUsagesResponse)
from app.utils import report

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=['User'])


@router.post("", response_model=UserResponse)
async def add_user(new_user: UserCreate,
                   db: DBDep,
                   admin: AdminDep):
    """
    Add a new user

    - **username** must have 3 to 32 characters and is allowed to contain a-z, 0-9, and underscores in between
    - **expire** must be a UTC timestamp
    - **data_limit** must be in Bytes, e.g. 1073741824B = 1GB
    - **services** list of service ids
    """
    # TODO expire should be datetime instead of timestamp

    try:
        db_user = crud.create_user(db, new_user,
                                   admin=crud.get_admin(db, admin.username))
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User already exists")

    user = UserResponse.model_validate(db_user)
    await marznode.operations.add_user(user=db_user)
    asyncio.create_task(
        report.user_created(
            user=user,
            user_id=db_user.id,
            by=admin
        ))
    logger.info("New user `%s` added", db_user.username)
    return user


@router.get("/{username}", response_model=UserResponse)
def get_user(db_user: UserDep):
    """
    Get users information
    """
    return db_user


@router.put("/{username}", response_model=UserResponse)
async def modify_user(db_user: UserDep,
                      modifications: UserModify,
                      db: DBDep,
                      admin: AdminDep):
    """
    Modify a user

    - set **expire** to 0 to make the user unlimited in time, null for no change
    - set **data_limit** to 0 to make the user unlimited in data, null for no change
    """
    old_status = db_user.status
    status_change = bool(modifications.status and modifications.status != db_user.status)
    if status_change and (modifications.status == UserStatus.disabled and
                          old_status in {UserStatus.active, UserStatus.on_hold}):
        await marznode.operations.remove_user(db_user)

    old_inbounds = {(i.node_id, i.protocol, i.tag) for i in db_user.inbounds}
    new_user = crud.update_user(db, db_user, modifications)
    new_inbounds = {(i.node_id, i.protocol, i.tag) for i in new_user.inbounds}
    user = UserResponse.model_validate(db_user)

    inbound_change = old_inbounds != new_inbounds
    if (user.status in {UserStatus.active, UserStatus.on_hold}
            and (not status_change or old_status == UserStatus.on_hold)):
        if inbound_change:
            await marznode.operations.update_user_inbounds(
                user=new_user, new_inbounds=new_inbounds, old_inbounds=old_inbounds)
    elif (user.status in {UserStatus.active, UserStatus.on_hold} and status_change and
            old_status not in {UserStatus.active, UserStatus.on_hold}):
        await marznode.operations.add_user(new_user)

    asyncio.create_task(report.user_updated(
        user=user,
        by=admin))
    
    logger.info("User `%s` modified", user.username)

    if status_change:
        asyncio.create_task(report.status_change(
            username=user.username,
            status=user.status,
            user=user,
            by=admin))

        logger.info("User `%s` status changed from `%s` to `%s`",
                    user.username,
                    old_status,
                    user.status)

    return user


@router.delete("/{username}")
async def remove_user(db_user: UserDep,
                      db: DBDep,
                      admin: AdminDep):
    """
    Remove a user
    """
    await marznode.operations.remove_user(db_user)

    crud.remove_user(db, db_user)
    db.flush()

    asyncio.create_task(
        report.user_deleted(
            username=db_user.username,
            by=admin
        ))
    logger.info("User %s deleted", db_user.username)
    return {}


@router.post("/{username}/reset", response_model=UserResponse)
async def reset_user_data_usage(db_user: UserDep,
                                db: DBDep,
                                admin: AdminDep):
    """
    Reset user data usage
    """
    previous_status = db_user.status
    db_user = crud.reset_user_data_usage(db, db_user)

    if db_user.status == UserStatus.active and previous_status == UserStatus.limited:
        await marznode.operations.add_user(db_user)

    user = UserResponse.model_validate(db_user)
    asyncio.create_task(report.user_data_usage_reset(
                user=user,
                by=admin))

    logger.info("User `%s`'s usage was reset", db_user.username)

    return user


@router.post("/{username}/revoke_sub", response_model=UserResponse)
async def revoke_user_subscription(db_user: UserDep,
                                   db: DBDep,
                                   admin: AdminDep):
    """
    Revoke users subscription (Subscription link and proxies)
    """
    db_user = crud.revoke_user_sub(db, db_user)

    if db_user.status in [UserStatus.active, UserStatus.on_hold]:
        await marznode.operations.remove_user(db_user)
        await marznode.operations.add_user(db_user)
    user = UserResponse.model_validate(db_user)
    asyncio.create_task(
        report.user_subscription_revoked(
            user=user,
            by=admin
        ))

    logger.info("User %s subscription revoked", db_user.username)

    return user


@router.get("", response_model=UsersResponse)
def get_users(db: DBDep,
              admin: AdminDep,
              offset: int = None,
              limit: int = None,
              username: List[str] = Query(None),
              status: UserStatus = None,
              sort: str = None):
    """
    Get all users
    """
    dbadmin = crud.get_admin(db, admin.username)

    if sort is not None:
        opts = sort.strip(',').split(',')
        sort = []
        for opt in opts:
            try:
                sort.append(crud.UsersSortingOptions[opt])
            except KeyError:
                raise HTTPException(status_code=400,
                                    detail=f'"{opt}" is not a valid sort option')

    users, count = crud.get_users(db=db,
                                  offset=offset,
                                  limit=limit,
                                  usernames=username,
                                  status=status,
                                  sort=sort,
                                  admin=dbadmin if not admin.is_sudo else None,
                                  return_with_count=True)

    return {"users": users, "total": count}


@router.post("/reset")
async def reset_users_data_usage(db: DBDep,
                                 admin: SudoAdminDep):
    """
    Reset all users data usage
    """
    dbadmin = crud.get_admin(db, admin.username)
    crud.reset_all_users_data_usage(db=db, admin=dbadmin)
    # startup_config = xray.config.include_db_users()
    await xray.core.restart(xray.config.include_db_users(node_id=0))
    for node_id, node in list(xray.nodes.items()):
        if node.connected:
            xray.operations.restart_node(node_id, xray.config.include_db_users(node_id=node_id))
    return {}


@router.get("/{username}/usage", response_model=UserUsagesResponse)
def get_user_usage(db: DBDep,
                   db_user: UserDep,
                   start_date: StartDateDep,
                   end_date: EndDateDep):
    """
    Get users usage
    """
    usages = crud.get_user_usages(db, db_user, start_date, end_date)

    return {"usages": usages, "username": db_user.username}


@router.put("/{username}/set-owner", response_model=UserResponse)
def set_owner(username: str,
              admin_username: str,
              db: DBDep,
              admin: SudoAdminDep):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_admin = crud.get_admin(db, username=admin_username)
    if not new_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    db_user = crud.set_owner(db, db_user, new_admin)
    user = UserResponse.model_validate(db_user)

    logger.info("`%s`'s owner successfully set to `%s`", user.username, admin.username)

    return user


@router.delete("/expired")
def delete_expired(passed_time: int,
                   db: DBDep,
                   admin: AdminDep):
    """
    Delete expired users
    - **passed_time** must be a timestamp
    - This function will delete all expired users that meet the specified number of days passed and can't be undone.
    """

    dbadmin = crud.get_admin(db, admin.username)

    db_users = crud.get_users(db=db,
                              status=[UserStatus.expired, UserStatus.limited],
                              admin=dbadmin if not admin.is_sudo else None)

    current_time = int(datetime.now(timezone.utc).timestamp())
    expiration_threshold = current_time - passed_time
    expired_users = [
        user for user in db_users if user.expire is not None and user.expire <= expiration_threshold]
    if not expired_users:
        raise HTTPException(status_code=404, detail="No expired user found.")

    for db_user in expired_users:
        crud.remove_user(db, db_user)

        asyncio.get_running_loop().create_task(
            report.user_deleted(
                username=db_user.username,
                by=admin
        ))

        logger.info("User `%s` removed", db_user.username)

    return {}
