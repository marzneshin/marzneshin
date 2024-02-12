from datetime import datetime, timezone
from typing import List

import asyncio
import sqlalchemy
from fastapi import BackgroundTasks, Depends, HTTPException, Query

from app import app, logger, marznode
from app.db import Session, crud, get_db
from app.models.admin import Admin
from app.models.user import (UserCreate, UserModify, UserResponse,
                             UsersResponse, UserStatus, UserUsagesResponse)
from app.utils import report


@app.post("/api/user", tags=['User'], response_model=UserResponse)
async def add_user(new_user: UserCreate,
             db: Session = Depends(get_db),
             admin: Admin = Depends(Admin.get_current)):
    """
    Add a new user

    - **username** must have 3 to 32 characters and is allowed to contain a-z, 0-9, and underscores in between
    - **expire** must be an UTC timestamp
    - **data_limit** must be in Bytes, e.g. 1073741824B = 1GB
    - **proxies** dictionary of protocol:settings
    - **inbounds** dictionary of protocol:inbound_tags, empty means all inbounds
    """
    # TODO expire should be datetime instead of timestamp

    try:
        dbuser = crud.create_user(db, new_user,
                                  admin=crud.get_admin(db, admin.username))
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User already exists")

    user = UserResponse.model_validate(dbuser)
    await marznode.operations.add_user(user=dbuser)
    asyncio.create_task(
        report.user_created(
        user=user,
        user_id=dbuser.id,
        by=admin
    ))
    logger.info(f"New user \"{dbuser.username}\" added")
    return user


@app.get("/api/user/{username}", tags=['User'], response_model=UserResponse)
def get_user(username: str,
             db: Session = Depends(get_db),
             admin: Admin = Depends(Admin.get_current)):
    """
    Get users information
    """
    if not (admin.is_sudo or (dbuser.admin and dbuser.admin.username == admin.username)):
        raise HTTPException(status_code=403, detail="You're not allowed")
    
    dbuser = crud.get_user(db, username)
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")

    return dbuser


@app.put("/api/user/{username}", tags=['User'], response_model=UserResponse)
async def modify_user(username: str,
                modified_user: UserModify,
                db: Session = Depends(get_db),
                admin: Admin = Depends(Admin.get_current)):
    """
    Modify a user

    - set **expire** to 0 to make the user unlimited in time, null to no change
    - set **data_limit** to 0 to make the user unlimited in data, null to no change
    - **proxies** dictionary of protocol:settings, empty means no change
    - **inbounds** dictionary of protocol:inbound_tags, empty means no change
    """
    dbuser = crud.get_user(db, username)
    if not (admin.is_sudo or (dbuser.admin and dbuser.admin.username == admin.username)):
        raise HTTPException(status_code=403, detail="You're not allowed")

    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")
    old_inbounds = {(i.node_id, i.protocol, i.tag) for i in dbuser.inbounds}
    old_status = dbuser.status
    new_user = crud.update_user(db, dbuser, modified_user)
    new_inbounds = {(i.node_id, i.protocol, i.tag) for i in new_user.inbounds}
    user = UserResponse.model_validate(dbuser)

    if user.status in [UserStatus.active, UserStatus.on_hold]:
        asyncio.create_task(marznode.operations.update_user(
            user=new_user, new_inbounds=new_inbounds, old_inbounds=old_inbounds)
                                               )
    else:
        asyncio.create_task(marznode.operations.remove_user(dbuser))
    
    asyncio.get_running_loop().create_task(report.user_updated(
                user=user,
                by=admin))
    
    logger.info(f"User \"{user.username}\" modified")

    if user.status != old_status:
        asyncio.get_running_loop().create_task(report.status_change(
                    username=user.username,
                    status=user.status,
                    user=user,
                    by=admin))
        logger.info(
            f"User \"{dbuser.username}\" status changed from {old_status} to {user.status}")

    return user


@app.delete("/api/user/{username}", tags=['User'])
async def remove_user(username: str,
                db: Session = Depends(get_db),
                admin: Admin = Depends(Admin.get_current)):
    """
    Remove a user
    """
    dbuser = crud.get_user(db, username)
    if not (admin.is_sudo or (dbuser.admin and dbuser.admin.username == admin.username)):
        raise HTTPException(status_code=403, detail="You're not allowed")

    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")
    
    await marznode.operations.remove_user(dbuser)

    crud.remove_user(db, dbuser)
    db.flush()

    asyncio.create_task(
        report.user_deleted(
        username=dbuser.username,
        by=admin
    ))
    logger.info(f"User \"{username}\" deleted")
    return {}


@app.post("/api/user/{username}/reset", tags=['User'], response_model=UserResponse)
async def reset_user_data_usage(username: str,
                          db: Session = Depends(get_db),
                          admin: Admin = Depends(Admin.get_current)):
    """
    Reset user data usage
    """
    db_user = crud.get_user(db, username)
    if not (admin.is_sudo or (db_user.admin and db_user.admin.username == admin.username)):
        raise HTTPException(status_code=403, detail="You're not allowed")

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    previous_status = db_user.status
    db_user = crud.reset_user_data_usage(db=db, dbuser=db_user)

    if db_user.status == UserStatus.active and previous_status == UserStatus.limited:
        await marznode.operations.add_user(db_user)

    user = UserResponse.model_validate(db_user)
    asyncio.create_task(report.user_data_usage_reset(
                user=user,
                by=admin))

    logger.info(f"User \"{username}\"'s usage was reset")

    return user


@app.post("/api/user/{username}/revoke_sub", tags=['User'], response_model=UserResponse)
async def revoke_user_subscription(username: str,
                             db: Session = Depends(get_db),
                             admin: Admin = Depends(Admin.get_current)):
    """
    Revoke users subscription (Subscription link and proxies)
    """
    if not (admin.is_sudo or (dbuser.admin and dbuser.admin.username == admin.username)):
        raise HTTPException(status_code=403, detail="You're not allowed")

    dbuser = crud.get_user(db, username)
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")

    dbuser = crud.revoke_user_sub(db=db, dbuser=dbuser)

    if dbuser.status in [UserStatus.active, UserStatus.on_hold]:
        asyncio.get_running_loop().create_task(xray.operations.update_user(dbuser=dbuser))
    user = UserResponse.model_validate(dbuser)
    asyncio.get_running_loop().create_task(
        report.user_subscription_revoked(
        user=user,
        by=admin
    ))

    logger.info(f"User \"{username}\" subscription revoked")

    return user


@app.get("/api/users", tags=['User'], response_model=UsersResponse)
def get_users(offset: int = None,
              limit: int = None,
              username: List[str] = Query(None),
              status: UserStatus = None,
              sort: str = None,
              db: Session = Depends(get_db),
              admin: Admin = Depends(Admin.get_current)):
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


@app.post("/api/users/reset", tags=['User'])
async def reset_users_data_usage(db: Session = Depends(get_db),
                           admin: Admin = Depends(Admin.get_current)):
    """
    Reset all users data usage
    """
    if not admin.is_sudo:
        raise HTTPException(status_code=403, detail="You're not allowed")

    dbadmin = crud.get_admin(db, admin.username)
    crud.reset_all_users_data_usage(db=db, admin=dbadmin)
    # startup_config = xray.config.include_db_users()
    await xray.core.restart(xray.config.include_db_users(node_id=0))
    for node_id, node in list(xray.nodes.items()):
        if node.connected:
            xray.operations.restart_node(node_id, xray.config.include_db_users(node_id=node_id))
    return {}


@app.get("/api/user/{username}/usage", tags=['User'], response_model=UserUsagesResponse)
def get_user_usage(username: str,
                   start: str = None,
                   end: str = None,
                   db: Session = Depends(get_db),
                   admin: Admin = Depends(Admin.get_current)):
    """
    Get users usage
    """
    dbuser = crud.get_user(db, username)
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")

    if start is None:
        start_date = datetime.fromtimestamp(
            datetime.utcnow().timestamp() - 30 * 24 * 3600)
    else:
        start_date = datetime.fromisoformat(start)

    if end is None:
        end_date = datetime.utcnow()
    else:
        end_date = datetime.fromisoformat(end)

    usages = crud.get_user_usages(db, dbuser, start_date, end_date)

    return {"usages": usages, "username": username}


@app.put("/api/user/{username}/set-owner", tags=['User'], response_model=UserResponse)
def set_owner(username: str,
              admin_username: str,
              db: Session = Depends(get_db),
              admin: Admin = Depends(Admin.get_current)):

    if not admin.is_sudo:
        raise HTTPException(status_code=403, detail="You're not allowed")

    dbuser = crud.get_user(db, username)
    if not dbuser:
        raise HTTPException(status_code=404, detail="User not found")

    new_admin = crud.get_admin(db, username=admin_username)
    if not new_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    dbuser = crud.set_owner(db, dbuser, new_admin)
    user = UserResponse.model_validate(dbuser)

    logger.info(f"{user.username}'s owner successfully set to {admin.username}")

    return user


@app.delete("/api/users/expired", tags=['User'])
def delete_expired(passed_time: int,
                   db: Session = Depends(get_db),
                   admin: Admin = Depends(Admin.get_current)):
    """
    Delete expired users
    - **passed_time** must be a timestamp
    - This function will delete all expired users that meet the specified number of days passed and can't be undone.
    """

    dbadmin = crud.get_admin(db, admin.username)

    dbusers = crud.get_users(db=db,
                             status=[UserStatus.expired, UserStatus.limited],
                             admin=dbadmin if not admin.is_sudo else None)

    current_time = int(datetime.now(timezone.utc).timestamp())
    expiration_threshold = current_time - passed_time
    expired_users = [
        user for user in dbusers if user.expire is not None and user.expire <= expiration_threshold]
    if not expired_users:
        raise HTTPException(status_code=404, detail=f'No expired user found.')

    for dbuser in expired_users:
        crud.remove_user(db, dbuser)

        asyncio.get_running_loop().create_task(
            report.user_deleted(
            username=dbuser.username,
            by=admin
        ))

        logger.info(f"User \"{dbuser.username}\" deleted")

    return {}
