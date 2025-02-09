import asyncio
import logging
from datetime import datetime, timedelta
from enum import Enum

import sqlalchemy
from fastapi import APIRouter
from fastapi import HTTPException, Query
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page

from app import marznode
from app.db import crud, User
from app.db.models import Service
from app.dependencies import (
    DBDep,
    AdminDep,
    SudoAdminDep,
    UserDep,
    StartDateDep,
    EndDateDep,
    ModifyUsersAccess,
)
from app.models.notification import UserNotification
from app.models.service import ServiceResponse
from app.models.user import (
    UserCreate,
    UserModify,
    UserResponse,
    UserUsageSeriesResponse,
)
from app.notification import notify

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["User"])


class UsersSortingOptions(str, Enum):
    USERNAME = "username"
    USED_TRAFFIC = "used_traffic"
    DATA_LIMIT = "data_limit"
    EXPIRE_DATE = "expire_date"
    CREATED_AT = "created_at"


user_filters = [
    "username",
    "is_active",
    "activated",
    "expired",
    "data_limit_reached",
    "enabled",
    "owner_username",
]


@router.get("", response_model=Page[UserResponse])
def get_users(
    db: DBDep,
    admin: AdminDep,
    username: list[str] = Query(None),
    order_by: UsersSortingOptions = Query(None),
    descending: bool = Query(False),
    is_active: bool | None = Query(None),
    activated: bool | None = Query(None),
    expired: bool | None = Query(None),
    data_limit_reached: bool | None = Query(None),
    enabled: bool | None = Query(None),
    owner_username: str | None = Query(None),
):
    """
    Filters users based on the options
    """
    dbadmin = crud.get_admin(db, admin.username)

    query = db.query(User).filter(User.removed == False)

    admin = dbadmin if not admin.is_sudo else None

    for name in user_filters:
        value = locals().get(name)
        if value is not None:
            if name == "username":
                if len(username) > 1:
                    query = query.filter(User.username.in_(username))
                else:
                    query = query.filter(
                        User.username.ilike(f"%{username[0]}%")
                    )
            elif name == "owner_username":
                if not dbadmin.is_sudo:
                    raise HTTPException(403, "You're not allowed.")
                filter_admin = crud.get_admin(db, value)
                if not filter_admin:
                    raise HTTPException(404, "owner_username not found.")
                query = query.filter(User.admin_id == filter_admin.id)
            else:
                query = query.filter(getattr(User, name) == value)

    if admin:
        query = query.filter(User.admin == admin)

    if order_by:
        order_column = getattr(User, order_by)
        if descending:
            order_column = order_column.desc()
        query = query.order_by(order_column)

    return paginate(db, query)


@router.post("", response_model=UserResponse)
async def add_user(new_user: UserCreate, db: DBDep, admin: AdminDep):
    """
    Add a new user

    - **username** must have 3 to 32 characters and is allowed to contain a-z, 0-9, and underscores in between
    - **expire_date** must be a datetime
    - **data_limit** must be in Bytes, e.g. 1073741824B = 1GB
    - **services** list of service ids
    """

    try:
        db_user = crud.create_user(
            db,
            new_user,
            admin=crud.get_admin(db, admin.username),
            allowed_services=(
                admin.service_ids
                if not admin.is_sudo and not admin.all_services_access
                else None
            ),
        )
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User already exists")

    user = UserResponse.model_validate(db_user)
    marznode.operations.update_user(user=db_user)

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.user_created, user=user, by=admin
        )
    )

    logger.info("New user `%s` added", db_user.username)
    return user


@router.post("/bulk", response_model=list[UserResponse])
async def add_bulk_users(
    new_users: list[UserCreate], db: DBDep, admin: AdminDep
):
    """
    Add a new user

    - **username** must have 3 to 32 characters and is allowed to contain a-z, 0-9, and underscores in between
    - **expire_date** must be a datetime
    - **data_limit** must be in Bytes, e.g. 1073741824B = 1GB
    - **services** list of service ids
    """

    try:
        created_users = crud.create_user(
            db,
            new_users,
            admin=crud.get_admin(db, admin.username),
            allowed_services=(
                admin.service_ids
                if not admin.is_sudo and not admin.all_services_access
                else None
            ),
        )

        user_responses = [
            UserResponse.model_validate(db_user) for db_user in created_users
        ]

        for db_user in created_users:
            marznode.operations.update_user(user=db_user)

        for user_response in user_responses:
            asyncio.ensure_future(
                report.user_created(
                    user=user_response, user_id=user_response.id, by=admin
                )
            )

        logger.info(
            "New users added: %s", [user.username for user in created_users]
        )

        return user_responses

    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409, detail="One or more users already exist"
        )


@router.post("/reset")
async def reset_users_data_usage(db: DBDep, admin: SudoAdminDep):
    """
    Reset all users data usage,
    You will need to restart for this to take effect for now
    """
    dbadmin = crud.get_admin(db, admin.username)
    crud.reset_all_users_data_usage(db=db, admin=dbadmin)
    return {}


@router.delete("/expired")
async def delete_expired(
    passed_time: int,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Delete expired users
    - **passed_time** must be a timestamp
    - This function will delete all expired users that meet the specified number of days passed and can't be undone.
    """

    dbadmin = crud.get_admin(db, admin.username)

    db_users = crud.get_users(
        db=db,
        expired=True,
        admin=dbadmin if not admin.is_sudo else None,
    )

    current_time = datetime.utcnow()
    expiration_threshold = current_time - timedelta(seconds=passed_time)
    expired_users = [
        user
        for user in db_users
        if user.expire_date is not None
        and user.expire_date <= expiration_threshold
    ]
    if not expired_users:
        raise HTTPException(status_code=404, detail="No expired user found.")

    for db_user in expired_users:
        crud.remove_user(db, db_user)

        logger.info("User `%s` removed", db_user.username)

    return {}


@router.get("/{username}", response_model=UserResponse)
def get_user(db_user: UserDep):
    """
    Get users information
    """
    return db_user


@router.put("/{username}", response_model=UserResponse)
async def modify_user(
    db_user: UserDep,
    modifications: UserModify,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Modify a user

    - set **data_limit** to 0 to make the user unlimited in data, null for no change
    """
    active_before = db_user.is_active

    old_inbounds = {(i.node_id, i.protocol, i.tag) for i in db_user.inbounds}
    new_user = crud.update_user(
        db,
        db_user,
        modifications,
        allowed_services=(
            admin.service_ids
            if not admin.is_sudo and not admin.all_services_access
            else None
        ),
    )
    active_after = new_user.is_active
    new_inbounds = {(i.node_id, i.protocol, i.tag) for i in new_user.inbounds}

    inbound_change = old_inbounds != new_inbounds

    if (
        inbound_change and new_user.is_active
    ) or active_before != active_after:
        marznode.operations.update_user(
            new_user, old_inbounds, remove=not db_user.is_active
        )
        db_user.activated = db_user.is_active
        db.commit()

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.user_updated,
            user=UserResponse.model_validate(db_user),
            by=admin,
        )
    )

    logger.info("User `%s` modified", db_user.username)

    if active_before != active_after:
        action = (
            UserNotification.Action.user_activated
            if active_after
            else UserNotification.Action.user_deactivated
        )

        asyncio.ensure_future(
            notify(
                action=action,
                user=UserResponse.model_validate(db_user),
                by=admin,
            )
        )

        logger.info(
            "User `%s` activation changed from `%s` to `%s`",
            db_user.username,
            active_before,
            active_after,
        )

    return db_user


@router.delete("/{username}")
async def remove_user(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Remove a user
    """
    marznode.operations.update_user(db_user, remove=True)

    deleted_username = db_user.username
    crud.remove_user(db, db_user)

    db_user.username = deleted_username
    user = UserResponse.model_validate(db_user)
    db.expunge(db_user)

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.user_deleted, user=user, by=admin
        )
    )

    logger.info("User %s deleted", db_user.username)
    return {}


@router.delete("/bulk")
async def remove_bulk_users(
    users: list[str],
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Remove bulk user
    """
    try:
        for username in users:
            user = crud.get_user(db, username)
            if not user:
                raise ValueError(f"User {username} not found")
            user.removed = True
            user.activated = False

        db.commit()

        for user in users:
            marznode.operations.update_user(user, remove=True)

        for username in users:
            asyncio.ensure_future(
                report.user_deleted(username=username, by=admin)
            )

        logger.info("Users %s deleted", ", ".join(users))
        return {}

    except (sqlalchemy.exc.IntegrityError, ValueError) as e:
        db.rollback()
        logger.error(f"Failed to delete users: {str(e)}")
        raise HTTPException(
            status_code=409,
            detail="Failed to delete one or more users. No users were deleted.",
        )


@router.get("/{username}/services", response_model=Page[ServiceResponse])
def get_user_services(user: UserDep, db: DBDep, admin: AdminDep):
    """
    Get user services
    """

    query = (
        db.query(Service)
        .join(Service.users)
        .where(User.username == user.username)
    )

    if not admin.is_sudo and not admin.all_services_access:
        query.filter(Service.id.in_(admin.service_ids))

    return paginate(query)


@router.post("/{username}/reset", response_model=UserResponse)
async def reset_user_data_usage(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Reset user data usage
    """
    was_active = db_user.is_active
    db_user = crud.reset_user_data_usage(db, db_user)

    if db_user.is_active and not was_active:
        marznode.operations.update_user(db_user)
        db_user.activated = True
        db.commit()

    user = UserResponse.model_validate(db_user)

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.data_usage_reset,
            user=user,
            by=admin,
        )
    )

    logger.info("User `%s`'s usage was reset", db_user.username)

    return user


@router.post("/bulk/reset", response_model=list[UserResponse])
async def reset_bulk_users_data_usage(
    usernames: list[str],
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Reset data usage for multiple users in bulk
    """
    users_to_update = []
    reset_users = []
    try:
        for username in usernames:
            user = crud.get_user(db, username)
            if not user:
                raise ValueError(f"User {username} not found")

            was_active = user.is_active
            user.traffic_reset_at = datetime.utcnow()
            user.used_traffic = 0

            if user.is_active and not was_active:
                user.activated = True

            users_to_update.append((user, was_active))
            reset_users.append(user)

        db.commit()

        for user, was_active in users_to_update:
            if user.is_active and not was_active:
                marznode.operations.update_user(user)

        for user in reset_users:
            asyncio.ensure_future(
                report.user_data_usage_reset(
                    user=UserResponse.model_validate(user), by=admin
                )
            )

        logger.info("Data usage reset for users: %s", ", ".join(usernames))
        return [UserResponse.model_validate(user) for user in reset_users]

    except (sqlalchemy.exc.IntegrityError, ValueError) as e:
        db.rollback()
        logger.error(f"Failed to reset data usage: {str(e)}")
        raise HTTPException(
            status_code=409,
            detail="Failed to reset data usage for one or more users. No changes were made.",
        )


@router.post("/{username}/enable", response_model=UserResponse)
async def enable_user(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Enables a user
    """
    if db_user.enabled:
        raise HTTPException(409, "User is already enabled")

    db_user.enabled = True

    if db_user.is_active:
        db_user.activated = True
        marznode.operations.update_user(db_user)

    db.commit()

    user = UserResponse.model_validate(db_user)

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.user_enabled, user=user, by=admin
        )
    )

    logger.info("User `%s` has been enabled", db_user.username)

    return user


@router.post("/bulk/enable", response_model=list[UserResponse])
async def bulk_enable_users(
    usernames: list[str],
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Bulk enable users
    """
    enabled_users = []
    marznode_updates = []

    try:
        for username in usernames:
            user = crud.get_user(db, username)
            if not user:
                raise HTTPException(
                    status_code=404, detail=f"User {username} not found"
                )

            if not user.enabled:
                user.enabled = True
                if user.is_active:
                    user.activated = True
                    marznode_updates.append(user)

                enabled_users.append(user)

        db.commit()

        for user in marznode_updates:
            marznode.operations.update_user(user)

        logger.info(
            "Users %s have been enabled",
            ", ".join(u.username for u in enabled_users),
        )

        return [UserResponse.model_validate(user) for user in enabled_users]

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to enable users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to enable users")


@router.post("/{username}/disable", response_model=UserResponse)
async def disable_user(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Disables a user
    """
    if not db_user.enabled:
        raise HTTPException(409, "User is not enabled")
    db_user.enabled = False
    db_user.activated = False
    db.commit()

    marznode.operations.update_user(db_user, remove=True)

    user = UserResponse.model_validate(db_user)

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.user_disabled, user=user, by=admin
        )
    )

    logger.info("User `%s` has been disabled", db_user.username)

    return user


@router.post("/bulk/disable", response_model=list[UserResponse])
async def bulk_disable_users(
    usernames: list[str],
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Bulk disable users
    """
    disabled_users = []

    try:
        for username in usernames:
            user = crud.get_user(db, username)
            if not user:
                raise HTTPException(
                    status_code=404, detail=f"User {username} not found"
                )

            if user.enabled:
                user.enabled = False
                user.activated = False
                disabled_users.append(user)

        db.commit()

        for user in disabled_users:
            marznode.operations.update_user(user, remove=True)

        logger.info(
            "Users %s have been disabled",
            ", ".join(u.username for u in disabled_users),
        )

        return [UserResponse.model_validate(user) for user in disabled_users]

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to disable users: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to disable users")


@router.post("/{username}/revoke_sub", response_model=UserResponse)
async def revoke_user_subscription(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Revoke users subscription (Subscription link and proxies)
    """
    db_user = crud.revoke_user_sub(db, db_user)

    if db_user.is_active:
        marznode.operations.update_user(db_user, remove=True)
        marznode.operations.update_user(db_user)

    user = UserResponse.model_validate(db_user)

    asyncio.ensure_future(
        notify(
            action=UserNotification.Action.subscription_revoked,
            user=user,
            by=admin,
        )
    )

    logger.info("User %s subscription revoked", db_user.username)

    return user


@router.get("/{username}/usage", response_model=UserUsageSeriesResponse)
def get_user_usage(
    db: DBDep, db_user: UserDep, start_date: StartDateDep, end_date: EndDateDep
):
    """
    Get users usage
    """

    return crud.get_user_usages(db, db_user, start_date, end_date)


@router.put("/{username}/set-owner", response_model=UserResponse)
def set_owner(
    username: str, admin_username: str, db: DBDep, admin: SudoAdminDep
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_admin = crud.get_admin(db, username=admin_username)
    if not new_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    db_user = crud.set_owner(db, db_user, new_admin)
    user = UserResponse.model_validate(db_user)

    logger.info(
        "`%s`'s owner successfully set to `%s`", user.username, admin.username
    )

    return user


@router.put("/bulk/set-owner", response_model=list[UserResponse])
def bulk_set_owner(
    usernames: list[str], admin_username: str, db: DBDep, admin: SudoAdminDep
):
    users_to_update = []
    new_admin = crud.get_admin(db, username=admin_username)
    if not new_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    try:
        for username in usernames:
            db_user = crud.get_user(db, username)
            if not db_user:
                raise HTTPException(
                    status_code=404, detail=f"User {username} not found"
                )
            users_to_update.append(db_user)

        updated_users = crud.bulk_set_owner(db, users_to_update, new_admin)

        logger.info(
            "Owner of users `%s` successfully set to `%s`",
            ", ".join(user.username for user in updated_users),
            new_admin.username,
        )

        return [UserResponse.model_validate(user) for user in updated_users]

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to set owner for users: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to set owner for users"
        )
