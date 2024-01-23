import io
import math
import re
import random
import string
import os
from datetime import datetime

import qrcode
import sqlalchemy
from dateutil.relativedelta import relativedelta
from telebot import types
from telebot.util import user_link
from telebot.asyncio_handler_backends import State, StatesGroup

from app import xray
from app.db import GetDB, crud
from app.models.user import (UserCreate, UserModify, UserResponse, UserStatus,
                             UserStatusModify)
from app.models.proxy import ProxyTypes
from app.telegram import bot
from app.telegram.utils.custom_filters import (query_equals,
                                               query_startswith)
from app.telegram.utils.keyboard import BotKeyboard
from app.utils.store import MemoryStorage
from app.utils.system import cpu_usage, memory_usage, readable_size

try:
    from app.utils.system import realtime_bandwith as realtime_bandwidth
except ImportError:
    from app.utils.system import realtime_bandwidth

from config import TELEGRAM_LOGGER_CHANNEL_ID, TELEGRAM_DEFAULT_VLESS_FLOW

mem_store = MemoryStorage()

class botStates(StatesGroup):
    start = State()
    add_data = State() # statesgroup should contain states
    add_time = State()
    edit_user_data_limit = State()
    edit_user_expire = State()
    edit_note = State()
    # add_user_from_template = State()
    add_user_username = State()
    add_user_data_limit = State()
    add_user_expire = State()


def get_system_info():
    mem = memory_usage()
    cpu = cpu_usage()
    with GetDB() as db:
        bandwidth = crud.get_system_usage(db)
        total_users = crud.get_users_count(db)
        users_active = crud.get_users_count(db, UserStatus.active)
    return """\
🎛 *CPU Cores*: `{cpu_cores}`
🖥 *CPU Usage*: `{cpu_percent}%`
➖➖➖➖➖➖➖
📊 *Total Memory*: `{total_memory}`
📈 *In Use Memory*: `{used_memory}`
📉 *Free Memory*: `{free_memory}`
➖➖➖➖➖➖➖
⬇️ *Download Usage*: `{down_bandwidth}`
⬆️ *Upload Usage*: `{up_bandwidth}`
↕️ *Total Usage*: `{total_bandwidth}`
➖➖➖➖➖➖➖
👥 *Total Users*: `{total_users}`
🟢 *Active Users*: `{active_users}`
🔴 *Deactivate Users*: `{deactivate_users}`
➖➖➖➖➖➖➖
⏫ *Upload Speed*: `{up_speed}`
⏬ *Download Speed*: `{down_speed}`
""".format(
        cpu_cores=cpu.cores,
        cpu_percent=cpu.percent,
        total_memory=readable_size(mem.total),
        used_memory=readable_size(mem.used),
        free_memory=readable_size(mem.free),
        total_bandwidth=readable_size(bandwidth.uplink + bandwidth.downlink),
        up_bandwidth=readable_size(bandwidth.uplink),
        down_bandwidth=readable_size(bandwidth.downlink),
        total_users=total_users,
        active_users=users_active,
        deactivate_users=total_users - users_active,
        up_speed=readable_size(realtime_bandwidth().outgoing_bytes),
        down_speed=readable_size(realtime_bandwidth().incoming_bytes)
    )


def schedule_delete_message(chat_id, *message_ids: int) -> None:
    messages: list[int] = mem_store.get(f"{chat_id}:messages_to_delete", [])
    for mid in message_ids:
        messages.append(mid)
    mem_store.set(f"{chat_id}:messages_to_delete", messages)


async def cleanup_messages(chat_id: int) -> None:
    messages: list[int] = mem_store.get(f"{chat_id}:messages_to_delete", [])
    for message_id in messages:
        try: await bot.delete_message(chat_id, message_id)
        except: pass
    mem_store.set(f"{chat_id}:messages_to_delete", [])


@bot.message_handler(commands=['start', 'help'], is_admin=True)
async def help_command(message: types.Message):
    await cleanup_messages(message.chat.id)
    # bot.clear_step_handler_by_chat_id(message.chat.id)
    await bot.delete_state(message.from_user.id, message.chat.id)
    return await bot.reply_to(message, """
{user_link} Welcome to Marzban Telegram-Bot Admin Panel.
Here you can manage your users and proxies.
To get started, use the buttons below.
""".format(
        user_link=user_link(message.from_user)
    ), parse_mode="html", reply_markup=BotKeyboard.main_menu())


@bot.callback_query_handler(query_equals('system'), is_admin=True)
async def system_command(call: types.CallbackQuery):
    return await bot.edit_message_text(
        get_system_info(),
        call.message.chat.id,
        call.message.message_id,
        parse_mode="MarkdownV2",
        reply_markup=BotKeyboard.main_menu()
    )


@bot.callback_query_handler(query_equals('restart'), is_admin=True)
async def restart_command(call: types.CallbackQuery):
    await bot.edit_message_text(
        '⚠️ Are you sure? This will restart Xray core.',
        call.message.chat.id,
        call.message.message_id,
        reply_markup=BotKeyboard.confirm_action(action='do_restart')
    )


@bot.callback_query_handler(query_startswith('delete:'), is_admin=True)
async def delete_user_command(call: types.CallbackQuery):
    username = call.data.split(':')[1]
    await bot.edit_message_text(
        f'⚠️ Are you sure? This will delete user `{username}`.',
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(
            action='do_delete', username=username)
    )


@bot.callback_query_handler(query_startswith("suspend:"), is_admin=True)
async def suspend_user_command(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will suspend user `{username}`.",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(
            action="do_suspend", username=username),
    )


@bot.callback_query_handler(query_startswith("activate:"), is_admin=True)
async def activate_user_command(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will activate user `{username}`.",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(
            action="do_activate", username=username),
    )


@bot.callback_query_handler(query_startswith("reset_usage:"), is_admin=True)
async def reset_usage_user_command(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will Reset Usage of user `{username}`.",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(
            action="do_reset_usage", username=username),
    )


@bot.callback_query_handler(query_equals('edit_all'), is_admin=True)
async def edit_all_command(call: types.CallbackQuery):
    with GetDB() as db:
        total_users = crud.get_users_count(db)
        active_users = crud.get_users_count(db, UserStatus.active)
        disabled_users = crud.get_users_count(db, UserStatus.disabled)
        expired_users = crud.get_users_count(db, UserStatus.expired)
        limited_users = crud.get_users_count(db, UserStatus.limited)
        text = f'''
👥 *Total Users*: `{total_users}`
✅ *Active Users*: `{active_users}`
❌ *Disabled Users*: `{disabled_users}`
🕰 *Expired Users*: `{expired_users}`
🪫 *Limited Users*: `{limited_users}`'''
    return await bot.edit_message_text(
        text,
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.edit_all_menu()
    )


@bot.callback_query_handler(query_equals('delete_expired'), is_admin=True)
async def delete_expired_command(call: types.CallbackQuery):
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will *DELETE All Expired Users*‼️",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(action="do_delete_expired"))


@bot.callback_query_handler(query_equals('delete_limited'), is_admin=True)
async def delete_limited_command(call: types.CallbackQuery):
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will *DELETE All Limited Users*‼️",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(action="do_delete_limited"))


@bot.callback_query_handler(query_equals('add_data'), is_admin=True)
async def add_data_command(call: types.CallbackQuery):
    msg = await bot.edit_message_text(
        f"🔋 Enter Data Limit to increase or decrease (GB):",
        call.message.chat.id,
        call.message.message_id,
        reply_markup=BotKeyboard.inline_cancel_action())
    schedule_delete_message(call.message.chat.id, call.message.id)
    schedule_delete_message(call.message.chat.id, msg.id)
    # return bot.register_next_step_handler(call.message, add_data_step)
    await bot.set_state(call.from_user.id, botStates.add_data, call.message.chat.id)


@bot.message_handler(state=botStates.add_data)
async def add_data_step(message):
    try:
        data_limit = float(message.text)
        if not data_limit:
            raise ValueError
    except ValueError:
        wait_msg = await bot.send_message(message.chat.id, '❌ Data limit must be a number and not zero.')
        schedule_delete_message(message.chat.id, wait_msg.message_id)
        return # bot.register_next_step_handler(wait_msg, add_data_step)
    schedule_delete_message(message.chat.id, message.message_id)
    msg = await bot.send_message(
        message.chat.id,
        f"⚠️ Are you sure? this will change Data limit of all users according to <b>"
        f"{'+' if data_limit > 0 else '-'}{readable_size(abs(data_limit *1024*1024*1024))}</b>",
        parse_mode="html",
        reply_markup=BotKeyboard.confirm_action('do_add_data', data_limit))
    await bot.delete_state(message.from_user.id, message.chat.id)
    await cleanup_messages(message.chat.id)
    schedule_delete_message(message.chat.id, msg.id)


@bot.callback_query_handler(query_equals('add_time'), is_admin=True)
async def add_time_command(call: types.CallbackQuery):
    msg = await bot.edit_message_text(
        f"📅 Enter Days to increase or decrease expiry:",
        call.message.chat.id,
        call.message.message_id,
        reply_markup=BotKeyboard.inline_cancel_action())
    schedule_delete_message(call.message.chat.id, call.message.id)
    schedule_delete_message(call.message.chat.id, msg.id)
    # return bot.register_next_step_handler(call.message, add_time_step)
    await bot.set_state(call.from_user.id, botStates.add_time, call.message.chat.id)


@bot.message_handler(state=botStates.add_time)
async def add_time_step(message):
    try:
        days = int(message.text)
        if not days:
            raise ValueError
    except ValueError:
        wait_msg = await bot.send_message(message.chat.id, '❌ Days must be as a number and not zero.')
        schedule_delete_message(message.chat.id, wait_msg.message_id)
        return # bot.register_next_step_handler(wait_msg, add_time_step)
    schedule_delete_message(message.chat.id, message.message_id)
    msg = await bot.send_message(
        message.chat.id,
        f"⚠️ Are you sure? this will change Expiry Time of all users according to <b>{days} Days</b>",
        parse_mode="html",
        reply_markup=BotKeyboard.confirm_action('do_add_time', days))
    await cleanup_messages(message.chat.id)
    schedule_delete_message(message.chat.id, msg.id)


@bot.callback_query_handler(query_startswith("inbound"), is_admin=True)
async def inbound_command(call: types.CallbackQuery):
    await bot.edit_message_text(
        f"Select inbound to *{call.data[8:].title()}* from all users",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.inbounds_menu(call.data, xray.config.inbounds_by_tag))


@bot.callback_query_handler(query_startswith("confirm_inbound"), is_admin=True)
async def delete_expired_confirm_command(call: types.CallbackQuery):
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will *{call.data[16:].replace(':', ' ')} for All Users*‼️",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(action=call.data[8:]))


@bot.callback_query_handler(query_startswith("edit:"), is_admin=True)
async def edit_command(call: types.CallbackQuery):
    # bot.clear_step_handler_by_chat_id(call.message.chat.id)
    await bot.delete_state(call.from_user.id, call.message.chat.id)
    username = call.data.split(":")[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(
                call.id,
                '❌ User not found.',
                show_alert=True
            )
        services = crud.get_services(db)
        user = UserResponse.model_validate(db_user)
    mem_store.set(f'{call.message.chat.id}:username', username)
    mem_store.set(f'{call.message.chat.id}:data_limit', db_user.data_limit)
    mem_store.set(f'{call.message.chat.id}:expire_date', datetime.fromtimestamp(db_user.expire) if db_user.expire else None)
    mem_store.set(f'{call.message.chat.id}:services', [s.id for s in db_user.services])
    await bot.edit_message_text(
        f"📝 Editing user `{username}`",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.select_services(
            services,
            [s.id for s in user.services],
            "edit",
            username=username,
            data_limit=db_user.data_limit,
            expire_date=mem_store.get(f"{call.message.chat.id}:expire_date"),
        )
    )


@bot.callback_query_handler(query_equals('help_edit'), is_admin=True)
async def help_edit_command(call: types.CallbackQuery):
    await bot.answer_callback_query(
        call.id,
        text="Press the (✏️ Edit) button to edit",
        show_alert=True
    )


@bot.callback_query_handler(query_equals('cancel'), is_admin=True)
async def cancel_command(call: types.CallbackQuery):
    # bot.clear_step_handler_by_chat_id(call.message.chat.id)
    await bot.delete_state(call.from_user.id, call.message.chat.id)
    return await bot.edit_message_text(
        get_system_info(),
        call.message.chat.id,
        call.message.message_id,
        parse_mode="MarkdownV2",
        reply_markup=BotKeyboard.main_menu()
    )


@bot.callback_query_handler(query_startswith('edit_user:'), is_admin=True)
async def edit_user_command(call: types.CallbackQuery):
    _, username, action = call.data.split(":")
    schedule_delete_message(call.message.chat.id, call.message.id)
    await cleanup_messages(call.message.chat.id)
    if action == "data":
        msg = await bot.send_message(
            call.message.chat.id,
            '⬆️ Enter Data Limit (GB):\n⚠️ Send 0 for unlimited.',
            reply_markup=BotKeyboard.inline_cancel_action(f'user:{username}')
        )
        mem_store.set(f"{call.message.chat.id}:edit_msg_text", call.message.text)
        await bot.delete_state(call.from_user.id, call.message.chat.id)
        await bot.set_state(call.from_user.id, botStates.edit_user_data_limit, call.message.chat.id)
        async with bot.retrieve_data(call.from_user.id, call.message.chat.id) as data:
            data["username"] = username 
                #bot.clear_step_handler_by_chat_id(call.message.chat.id)
        #bot.register_next_step_handler(
        #    call.message, edit_user_data_limit_step, username)
        schedule_delete_message(call.message.chat.id, msg.message_id)
    elif action == "expire":
        msg = await bot.send_message(
            call.message.chat.id,
            '⬆️ Enter Expire Date (YYYY-MM-DD)\nOr You Can Use Regex Symbol: ^[0-9]{1,3}(M|D) :\n⚠️ Send 0 for never expire.',
            reply_markup=BotKeyboard.inline_cancel_action(f'user:{username}'))
        mem_store.set(f"{call.message.chat.id}:edit_msg_text", call.message.text)
        # bot.clear_step_handler_by_chat_id(call.message.chat.id)
        await bot.set_state(call.from_user.id, botStates.edit_user_expire, call.message.chat.id)
        async with bot.retrieve_data(call.from_user.id, call.message.chat.id) as data:
            data["username"] = username 
        #bot.register_next_step_handler(
        #    call.message, edit_user_expire_step, username=username)
        schedule_delete_message(call.message.chat.id, msg.message_id)


@bot.message_handler(state=botStates.edit_user_data_limit)
async def edit_user_data_limit_step(message: types.Message):
    try:
        if float(message.text) < 0:
            wait_msg = await bot.send_message(message.chat.id, '❌ Data limit must be greater or equal to 0.')
            schedule_delete_message(message.chat.id, wait_msg.message_id)
            return # bot.register_next_step_handler(wait_msg, edit_user_data_limit_step, username=username)
        data_limit = float(message.text) * 1024**3
    except ValueError:
        wait_msg = await bot.send_message(message.chat.id, '❌ Data limit must be a number.')
        schedule_delete_message(message.chat.id, wait_msg.message_id)
        return # bot.register_next_step_handler(wait_msg, edit_user_data_limit_step, username=username)
    mem_store.set(f'{message.chat.id}:data_limit', data_limit)
    schedule_delete_message(message.chat.id, message.message_id)
    text = mem_store.get(f"{message.chat.id}:edit_msg_text")
    mem_store.delete(f"{message.chat.id}:edit_msg_text")
    async with bot.retrieve_data(call.from_user.id, call.message.chat.id) as data:
        username = data["username"]
        del data["username"]
    await bot.send_message(
        message.chat.id,
        text or f"📝 Editing user <code>{username}</code>",
        parse_mode="html",
        reply_markup=BotKeyboard.select_protocols(
        mem_store.get(f'{message.chat.id}:protocols'), "edit",
        username=username, data_limit=data_limit, expire_date=mem_store.get(f'{message.chat.id}:expire_date')))
    await cleanup_messages(message.chat.id)


@bot.message_handler(state=botStates.edit_user_expire)
async def edit_user_expire_step(message: types.Message):
    try:
        now = datetime.now()
        today = datetime(
            year=now.year,
            month=now.month,
            day=now.day,
            hour=23,
            minute=59,
            second=59
        )
        if re.match(r'^[0-9]{1,3}(M|m|D|d)$', message.text):
            expire_date = today
            number_pattern = r'^[0-9]{1,3}'
            number = int(re.findall(number_pattern, message.text)[0])
            symbol_pattern = r'(M|m|D|d)$'
            symbol = re.findall(symbol_pattern, message.text)[0].upper()
            if symbol == 'M':
                expire_date = today + relativedelta(months=number)
            elif symbol == 'D':
                expire_date = today + relativedelta(days=number)
        elif message.text != '0':
            expire_date = datetime.strptime(message.text, "%Y-%m-%d")
        else:
            expire_date = None
        if expire_date and expire_date < today:
            wait_msg = await bot.send_message(message.chat.id, '❌ Expire date must be greater than today.')
            schedule_delete_message(message.chat.id, wait_msg.message_id)
            return # bot.register_next_step_handler(wait_msg, edit_user_expire_step, username=username)
    except ValueError:
        wait_msg = await bot.send_message(message.chat.id, '❌ Expire date must be in YYYY-MM-DD format.\nOr You Can Use Regex Symbol: ^[0-9]{1,3}(M|D)')
        schedule_delete_message(message.chat.id, wait_msg.message_id)
        return # bot.register_next_step_handler(wait_msg, edit_user_expire_step, username=username)

    mem_store.set(f'{message.chat.id}:expire_date', expire_date)
    schedule_delete_message(message.chat.id, message.message_id)
    text = mem_store.get(f"{message.chat.id}:edit_msg_text")
    mem_store.delete(f"{message.chat.id}:edit_msg_text")
    async with bot.retrieve_data(call.from_user.id, call.message.chat.id) as data:
        username = data["username"]
        del data["username"]
    await bot.send_message(
        message.chat.id,
        text or f"📝 Editing user <code>{username}</code>",
        parse_mode="html",
        reply_markup=BotKeyboard.select_protocols(
        mem_store.get(f'{message.chat.id}:protocols'), "edit",
        username=username, data_limit=mem_store.get(f'{message.chat.id}:data_limit'), expire_date=expire_date))
    await cleanup_messages(message.chat.id)


@bot.callback_query_handler(query_startswith('users:'), is_admin=True)
async def users_command(call: types.CallbackQuery):
    page = int(call.data.split(':')[1]) if len(call.data.split(':')) > 1 else 1
    with GetDB() as db:
        total_pages = math.ceil(crud.get_users_count(db) / 10)
        users = crud.get_users(db, offset=(page - 1) * 10, limit=10, sort=[crud.UsersSortingOptions["-created_at"]])
        text = """👥 Users: (Page {page}/{total_pages})
✅ Active
❌ Disabled
🕰 Expired
🪫 Limited""".format(page=page, total_pages=total_pages)

    await bot.edit_message_text(
        text,
        call.message.chat.id,
        call.message.message_id,
        parse_mode="HTML",
        reply_markup=BotKeyboard.user_list(
            users, page, total_pages=total_pages)
    )


def get_user_info_text(
        status: str, username: str, sub_url: str, data_limit: int = None,
        usage: int = None, expire: int = None, note: str = None) -> str:
    statuses = {
        'active': '✅',
        'expired': '🕰',
        'limited': '🪫',
        'disabled': '❌'}
    text = f"""\
┌─{statuses[status]} <b>Status:</b> <code>{status.title()}</code>
│          └─<b>Username:</b> <code>{username}</code>
│
├─🔋 <b>Data limit:</b> <code>{readable_size(data_limit) if data_limit else 'Unlimited'}</code>
│          └─<b>Data Used:</b> <code>{readable_size(usage) if usage else "-"}</code>
│
├─📅 <b>Expiry Date:</b> <code>{datetime.fromtimestamp(expire).date() if expire else 'Never'}</code>
│           └─<b>Days left:</b> <code>{(datetime.fromtimestamp(expire or 0) - datetime.now()).days if expire else '-'}</code>
│
"""
    if note:
        text += f'├─📝 <b>Note:</b> <code>{note}</code>\n│\n'
    text += f'└─🚀 <b><a href="{sub_url}">Subscription</a>:</b> <code>{sub_url}</code>'
    return text



@bot.callback_query_handler(query_startswith('edit_note:'), is_admin=True)
async def edit_note_command(call: types.CallbackQuery):
    username = call.data.split(':')[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(call.id, '❌ User not found.', show_alert=True)
    schedule_delete_message(call.message.chat.id, call.message.id)
    await cleanup_messages(call.message.chat.id)
    msg = await bot.send_message(
        call.message.chat.id,
        f'<b>📝 Current Note:</b> <code>{db_user.note}</code>\n\nSend new Note for <code>{username}</code>',
        parse_mode="HTML",
        reply_markup=BotKeyboard.inline_cancel_action(f'user:{username}'))
    mem_store.set(f'{call.message.chat.id}:username', username)
    schedule_delete_message(call.message.chat.id, msg.id)
    await bot.set_state(call.from_user.id, botStates.edit_note, call.message.chat.id)
    # bot.register_next_step_handler(msg, edit_note_step)

@bot.message_handler(state=botStates.edit_note)
async def edit_note_step(message: types.Message):
    note = message.text or ''
    if len(note) > 500:
        wait_msg = await bot.send_message(message.chat.id, '❌ Note can not be more than 500 characters.')
        schedule_delete_message(message.chat.id, wait_msg.id)
        schedule_delete_message(message.chat.id, message.id)
        return # bot.register_next_step_handler(wait_msg, edit_note_step)
    username = mem_store.get(f'{message.chat.id}:username')
    if not username:
        await cleanup_messages(message.chat.id)
        await bot.reply_to(message, '❌ Something went wrong!\n restart bot /start')
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        last_note = db_user.note
        db_user = crud.update_user(db, db_user, UserModify(username=username, note=note))
        user = UserResponse.model_validate(db_user)
    text = get_user_info_text(
        status=user.status,
        username=user.username,
        sub_url=user.subscription_url,
        expire=user.expire,
        data_limit=user.data_limit,
        usage=user.used_traffic,
        note=user.note)
    await bot.reply_to(message, text, parse_mode="html", reply_markup=BotKeyboard.user_menu(user_info={
        'status': user.status,
        'username': user.username}, note=True))
    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
📝 <b>#Edit_Note #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{username}</code>
<b>Last Note :</b> <code>{last_note}</code>
<b>New Note :</b> <code>{note}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={message.chat.id}">{message.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass



@bot.callback_query_handler(query_startswith('user:'), is_admin=True)
async def user_command(call: types.CallbackQuery):
    await bot.delete_state(call.from_user.id, call.message.chat.id)
    # bot.clear_step_handler_by_chat_id(call.message.chat.id)
    username = call.data.split(':')[1]
    page = int(call.data.split(':')[2]) if len(call.data.split(':')) > 2 else 1
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(
                call.id,
                '❌ User not found.',
                show_alert=True
            )
        user = UserResponse.model_validate(db_user)
    text = get_user_info_text(
        status=user.status, username=username, sub_url=user.subscription_url,
        data_limit=user.data_limit, usage=user.used_traffic, expire=user.expire, note=user.note)
    await bot.edit_message_text(
        text,
        call.message.chat.id, call.message.message_id, parse_mode="HTML",
        reply_markup=BotKeyboard.user_menu(
            {'username': user.username, 'status': user.status},
            page=page, note=True))


@bot.callback_query_handler(query_startswith("revoke_sub:"), is_admin=True)
async def revoke_sub_command(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    await bot.edit_message_text(
        f"⚠️ Are you sure? This will *Revoke Subscription* link for `{username}`‼️",
        call.message.chat.id,
        call.message.message_id,
        parse_mode="markdown",
        reply_markup=BotKeyboard.confirm_action(action="do_revoke", username=username))


@bot.callback_query_handler(query_startswith("links:"), is_admin=True)
async def links_command(call: types.CallbackQuery):
    username = call.data.split(":")[1]

    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(call.id, "User not found!", show_alert=True)

        user = UserResponse.model_validate(db_user)

    text = f"<code>{user.subscription_url}</code>\n\n\n"
    for link in user.links:
        text += f"<code>{link}</code>\n\n"

    await bot.edit_message_text(
        text,
        call.message.chat.id,
        call.message.message_id,
        parse_mode="HTML",
        reply_markup=BotKeyboard.show_links(username)
    )


@bot.callback_query_handler(query_startswith("genqr:"), is_admin=True)
async def genqr_command(call: types.CallbackQuery):
    username = call.data.split(":")[1]

    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(call.id, "User not found!", show_alert=True)

        user = UserResponse.model_validate(db_user)

    await bot.answer_callback_query(call.id, "Generating QR code...")

    for link in user.links:
        f = io.BytesIO()
        qr = qrcode.QRCode(border=6)
        qr.add_data(link)
        qr.make_image().save(f)
        f.seek(0)
        await bot.send_photo(
            call.message.chat.id,
            photo=f,
            caption=f"<code>{link}</code>",
            parse_mode="HTML"
        )
    with io.BytesIO() as f:
        qr = qrcode.QRCode(border=6)
        qr.add_data(user.subscription_url)
        qr.make_image().save(f)
        f.seek(0)
        await bot.send_photo(
            call.message.chat.id,
            photo=f,
            caption=get_user_info_text(
                status=user.status,
                username=user.username,
                sub_url=user.subscription_url,
                data_limit=user.data_limit,
                usage=user.used_traffic,
                expire=user.expire
            ),
            parse_mode="HTML",
            reply_markup=BotKeyboard.subscription_page(user.subscription_url)
        )
    try:
        await bot.delete_message(call.message.chat.id, call.message.message_id)
    except:
        pass

    text = f"<code>{user.subscription_url}</code>\n\n\n"
    for link in user.links:
        text += f"<code>{link}</code>\n\n"

    await bot.send_message(
        call.message.chat.id,
        text,
        "HTML",
        reply_markup=BotKeyboard.show_links(username)
    )

@bot.callback_query_handler(query_startswith('random'), is_admin=True)
async def random_username(call: types.CallbackQuery):
    # bot.clear_step_handler_by_chat_id(call.message.chat.id)
    await bot.delete_state(call.from_user.id, call.message.chat.id)
    template_id = int(call.data.split(":")[1] or 0)
    mem_store.delete(f'{call.message.chat.id}:template_id')

    characters = string.ascii_letters + string.digits
    username = random.choice(characters) + ''.join(random.choices(characters, k=4)) + '_' + ''.join(random.choices(characters, k=4))

    schedule_delete_message(call.message.chat.id, call.message.id)
    await cleanup_messages(call.message.chat.id)

    msg = await bot.send_message(call.message.chat.id,
        '⬆️ Enter Data Limit (GB):\n⚠️ Send 0 for unlimited.',
        reply_markup=BotKeyboard.inline_cancel_action())
    schedule_delete_message(call.message.chat.id, msg.id)
    await bot.set_state(call.from_user.id, botStates.add_user_data_limit, call.message.chat.id)
    async with bot.retrieve_data(call.from_user.id, call.message.chat.id) as data:
        data["username"] = username
    return 


@bot.callback_query_handler(query_equals('add_user'), is_admin=True)
async def add_user_command(call: types.CallbackQuery):
    try:
        await bot.delete_message(call.message.chat.id, call.message.message_id)
    except:  # noqa
        pass
    username_msg = await bot.send_message(
        call.message.chat.id,
        '👤 Enter username:\n⚠️Username only can be 3 to 32 characters and contain a-z, A-Z 0-9, and underscores in '
        'between.',
        reply_markup=BotKeyboard.random_username())
    schedule_delete_message(call.message.chat.id, username_msg.id)
    await bot.set_state(call.from_user.id, botStates.add_user_username, call.message.chat.id)
    # bot.register_next_step_handler(username_msg, add_user_username_step)

@bot.message_handler(state=botStates.add_user_username)
async def add_user_username_step(message: types.Message):
    username = message.text
    if not username:
        wait_msg = await bot.send_message(message.chat.id, '❌ Username can not be empty.')
        schedule_delete_message(message.chat.id, wait_msg.id)
        schedule_delete_message(message.chat.id, message.id)
        return # bot.register_next_step_handler(wait_msg, add_user_username_step)
    if not re.match(r'^(?!.*__)(?!.*_$)\w{2,31}[a-zA-Z\d]$', username):
        wait_msg = await bot.send_message(message.chat.id,
            '❌ Username only can be 3 to 32 characters and contain a-z, A-Z, 0-9, and underscores in between.')
        schedule_delete_message(message.chat.id, wait_msg.id)
        schedule_delete_message(message.chat.id, message.id)
        return # bot.register_next_step_handler(wait_msg, add_user_username_step)
    with GetDB() as db:
        if crud.get_user(db, username):
            wait_msg = await bot.send_message(message.chat.id, '❌ Username already exists.')
            schedule_delete_message(message.chat.id, wait_msg.id)
            schedule_delete_message(message.chat.id, message.id)
            return # bot.register_next_step_handler(wait_msg, add_user_username_step)
    schedule_delete_message(message.chat.id, message.id)
    await cleanup_messages(message.chat.id)
    msg = await bot.send_message(message.chat.id,
        '⬆️ Enter Data Limit (GB):\n⚠️ Send 0 for unlimited.',
        reply_markup=BotKeyboard.inline_cancel_action())
    schedule_delete_message(message.chat.id, msg.id)
    await bot.set_state(message.from_user.id, botStates.add_user_data_limit, message.chat.id)
    async with bot.retrieve_data(message.from_user.id, message.chat.id) as data:
        data["username"] = username 
    # bot.register_next_step_handler(msg, add_user_data_limit_step, username=username)


@bot.message_handler(state=botStates.add_user_data_limit)
async def add_user_data_limit_step(message: types.Message):
    try:
        if float(message.text) < 0:
            wait_msg = await bot.send_message(message.chat.id, '❌ Data limit must be greater or equal to 0.')
            schedule_delete_message(message.chat.id, wait_msg.id)
            schedule_delete_message(message.chat.id, message.id)
            return #bot.register_next_step_handler(wait_msg, add_user_data_limit_step, username=username)
        data_limit = float(message.text) * 1024 * 1024 * 1024
    except ValueError:
        wait_msg = await bot.send_message(message.chat.id, '❌ Data limit must be a number.')
        schedule_delete_message(message.chat.id, wait_msg.id)
        schedule_delete_message(message.chat.id, message.id)
        return # bot.register_next_step_handler(wait_msg, add_user_data_limit_step, username=username)
    schedule_delete_message(message.chat.id, message.id)
    await cleanup_messages(message.chat.id)
    msg = await bot.send_message(message.chat.id,
        '⬆️ Enter Expire Date (YYYY-MM-DD)\nOr You Can Use Regex Symbol: ^[0-9]{1,3}(M|D) :\n⚠️ Send 0 for never expire.',
        reply_markup=BotKeyboard.inline_cancel_action())
    schedule_delete_message(message.chat.id, msg.id)
    await bot.set_state(message.from_user.id, botStates.add_user_expire, message.chat.id)
    async with bot.retrieve_data(message.from_user.id, message.chat.id) as data:
        data["data_limit"] = data_limit
    
    # bot.register_next_step_handler(msg, add_user_expire_step, username=username, data_limit=data_limit)

@bot.message_handler(state=botStates.add_user_expire)
async def add_user_expire_step(message: types.Message):
    try:
        now = datetime.now()
        today = datetime(
            year=now.year,
            month=now.month,
            day=now.day,
            hour=23,
            minute=59,
            second=59
        )
        if re.match(r'^[0-9]{1,3}(M|m|D|d)$', message.text):
            expire_date = today
            number_pattern = r'^[0-9]{1,3}'
            number = int(re.findall(number_pattern, message.text)[0])
            symbol_pattern = r'(M|m|D|d)$'
            symbol = re.findall(symbol_pattern, message.text)[0].upper()
            if symbol == 'M':
                expire_date = today + relativedelta(months=number)
            elif symbol == 'D':
                expire_date = today + relativedelta(days=number)
        elif message.text != '0':
            expire_date = datetime.strptime(message.text, "%Y-%m-%d")
        else:
            expire_date = None
        if expire_date and expire_date < today:
            wait_msg = await bot.send_message(message.chat.id, '❌ Expire date must be greater than today.')
            schedule_delete_message(message.chat.id, wait_msg.id)
            schedule_delete_message(message.chat.id, message.id)
            return # bot.register_next_step_handler(wait_msg, add_user_expire_step, username=username, data_limit=data_limit)
    except ValueError:
        wait_msg = await bot.send_message(message.chat.id,
            '❌ Expire date must be in YYYY-MM-DD format.\nOr You Can Use Regex Symbol: ^[0-9]{1,3}(M|D)')
        schedule_delete_message(message.chat.id, wait_msg.id)
        schedule_delete_message(message.chat.id, message.id)
        return # bot.register_next_step_handler(wait_msg, add_user_expire_step, username=username, data_limit=data_limit)
    async with bot.retrieve_data(message.from_user.id, message.chat.id) as data:
        username, data_limit = data["username"], data["data_limit"]
    mem_store.set(f'{message.chat.id}:username', username)
    mem_store.set(f'{message.chat.id}:data_limit', data_limit)
    mem_store.set(f'{message.chat.id}:expire_date', expire_date)

    with GetDB() as db:
        services = crud.get_services(db)
    schedule_delete_message(message.chat.id, message.id)
    await cleanup_messages(message.chat.id)
    await bot.send_message(
        message.chat.id,
        'Select Services:\nUsernames: {}\nData Limit: {}\nExpiry Date {}'.format(
            mem_store.get(f'{message.chat.id}:username'),
            readable_size(mem_store.get(f'{message.chat.id}:data_limit'))
            if mem_store.get(f'{message.chat.id}:data_limit') else "Unlimited",
            mem_store.get(f'{message.chat.id}:expire_date').strftime("%Y-%m-%d")
            if mem_store.get(f'{message.chat.id}:expire_date') else 'Never'
        ),
        reply_markup=BotKeyboard.select_services(services, [], action="create")
    )


@bot.callback_query_handler(query_startswith('switch_service:'), is_admin=True)
async def switch_service(call: types.CallbackQuery):
    if not (username := mem_store.get(f'{call.message.chat.id}:username')):
        return await bot.answer_callback_query(call.id, '❌ No user selected.', show_alert=True)
    selected_services: List[int] = mem_store.get(f'{call.message.chat.id}:services', [])
    _, service, action = call.data.split(':')
    service = int(service)

    with GetDB() as db:
        services = crud.get_services(db)
    if service in selected_services:
        selected_services.remove(service)
    else:
        selected_services.append(service)

    mem_store.set(f'{call.message.chat.id}:services', selected_services)

    if action in ["edit"]:
        return await bot.edit_message_text(
            call.message.text,
            call.message.chat.id,
            call.message.message_id,
            reply_markup=BotKeyboard.select_services(
                services,
                selected_services,
                "edit",
                username=username,
                data_limit=mem_store.get(f"{call.message.chat.id}:data_limit"),
                expire_date=mem_store.get(f"{call.message.chat.id}:expire_date"))
        )
    await bot.edit_message_text(
        call.message.text,
        call.message.chat.id,
        call.message.message_id,
        reply_markup=BotKeyboard.select_services(services, selected_services, "create")
    )


@bot.callback_query_handler(query_startswith('confirm:'), is_admin=True)
async def confirm_user_command(call: types.CallbackQuery):
    data = call.data.split(':')[1]
    chat_id = call.from_user.id
    full_name = call.from_user.full_name
    now = datetime.now()
    today = datetime(
        year=now.year,
        month=now.month,
        day=now.day,
        hour=23,
        minute=59,
        second=59)

@bot.callback_query_handler(query_startswith("do_delete"), is_admin=True)
async def delete_user(call: types.CallbackQuery):
    username = call.data.split(':')[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        crud.remove_user(db, db_user)
        await xray.operations.remove_user(db_user)

    await bot.edit_message_text(
        '✅ User deleted.',
        call.message.chat.id,
        call.message.message_id,
        reply_markup=BotKeyboard.main_menu()
    )
    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
🗑 <b>#Deleted #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{db_user.username}</code>
<b>Traffic Limit :</b> <code>{readable_size(db_user.data_limit) if db_user.data_limit else "Unlimited"}</code>
<b>Expire Date :</b> <code>\
{datetime.fromtimestamp(db_user.expire).strftime('%H:%M:%S %Y-%m-%d') if db_user.expire else "Never"}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass


@bot.callback_query_handler(query_startswith("do_suspend"), is_admin=True)
async def disable_user(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        crud.update_user(db, db_user, UserModify(
            username=username,
            status=UserStatusModify.disabled))
        await xray.operations.remove_user(db_user)
        user = UserResponse.model_validate(db_user)
    await bot.edit_message_text(
        get_user_info_text(
            status='disabled',
            username=username,
            sub_url=user.subscription_url,
            data_limit=db_user.data_limit,
            usage=db_user.used_traffic,
            expire=db_user.expire,
            note=user.note
        ),
        call.message.chat.id,
        call.message.message_id,
        parse_mode='HTML',
        reply_markup=BotKeyboard.user_menu(user_info={
            'status': 'disabled',
            'username': db_user.username
        }, note=True))
    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
❌ <b>#Disabled  #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass

@bot.callback_query_handler(query_startswith("do_activate"), is_admin=True)
async def activate_user(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        crud.update_user(db, db_user, UserModify(
            username=username,
            status=UserStatusModify.active))
        await xray.operations.add_user(db_user)
        user = UserResponse.model_validate(db_user)
    await bot.edit_message_text(
        get_user_info_text(
            status='active',
            username=username,
            sub_url=user.subscription_url,
            data_limit=db_user.data_limit,
            usage=db_user.used_traffic,
            expire=db_user.expire,
            note=user.note
        ),
        call.message.chat.id,
        call.message.message_id,
        parse_mode='HTML',
        reply_markup=BotKeyboard.user_menu(user_info={
            'status': 'active',
            'username': db_user.username
        }, note=True))
    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
✅ <b>#Activated  #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass

@bot.callback_query_handler(query_startswith("do_reset_usage"), is_admin=True)
async def reset_all_usages(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        crud.reset_user_data_usage(db, db_user)
        user = UserResponse.model_validate(db_user)
    await bot.edit_message_text(
        get_user_info_text(
            status=user.status,
            username=username,
            sub_url=user.subscription_url,
            data_limit=user.data_limit,
            usage=user.used_traffic,
            expire=user.expire,
            note=user.note
        ),
        call.message.chat.id,
        call.message.message_id,
        parse_mode='HTML',
        reply_markup=BotKeyboard.user_menu(user_info={
            'status': user.status,
            'username': user.username
        }, note=True))
    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
🔁 <b>#Reset_usage  #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username</b> : <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass


@bot.callback_query_handler(query_equals("do_restart"), is_admin=True)
async def restart_xray(call: types.CallbackQuery):
    m = await bot.edit_message_text(
        '🔄 Restarting XRay core...', call.message.chat.id, call.message.message_id)
    await xray.core.restart(xray.config.include_db_users())
    for node_id, node in list(xray.nodes.items()):
        if await node.is_healthy():
            await xray.operations.restart_node(node_id, xray.config.include_db_users())
    await bot.edit_message_text(
        '✅ XRay core restarted successfully.',
        m.chat.id, m.message_id,
        reply_markup=BotKeyboard.main_menu()
    )

@bot.callback_query_handler(query_equals("edit_user_done"), is_admin=True)
async def edit_user(call: types.CallbackQuery):
    if (username := mem_store.get(f'{call.message.chat.id}:username')) is None:
        try:
            await bot.delete_message(call.message.chat.id,
                               call.message.message_id)
        except Exception:
            pass
        return await bot.send_message(
            call.message.chat.id,
            '❌ Bot reload detected. Please start over.',
            reply_markup=BotKeyboard.main_menu()
        )

    if not mem_store.get(f'{call.message.chat.id}:services'):
        return await bot.answer_callback_query(
            call.id,
            '❌ No Service selected.',
            show_alert=True
        )

    #inbounds: dict[str, list[str]] = {
    #    k: v for k, v in mem_store.get(f'{call.message.chat.id}:protocols').items() if v}
    services: List[int] = mem_store.get(f"{call.message.chat.id}:services")

    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(call.id, text=f"User not found!", show_alert=True)

        # proxies = {p.type.value: p.settings for p in db_user.proxies}

        """for protocol in xray.config.inbounds_by_protocol:
            if protocol in inbounds and protocol not in db_user.inbounds:
                proxies.update({protocol: {'flow': TELEGRAM_DEFAULT_VLESS_FLOW} if
                                TELEGRAM_DEFAULT_VLESS_FLOW and protocol == ProxyTypes.VLESS else {}})
            elif protocol in db_user.inbounds and protocol not in inbounds:
                del proxies[protocol]"""

        modify = UserModify(
            username=username,
            # status=db_user.status,
            expire=int(mem_store.get(f'{call.message.chat.id}:expire_date').timestamp())
            if mem_store.get(f'{call.message.chat.id}:expire_date') else 0, 
            data_limit=mem_store.get(f"{call.message.chat.id}:data_limit"),
            services=services)
        last_user = UserResponse.model_validate(db_user)
        db_user = crud.update_user(db, db_user, modify)

        user = UserResponse.model_validate(db_user)

    if user.status == UserStatus.active:
        await xray.operations.update_user(db_user)
    else:
        await xray.operations.remove_user(db_user)

    await bot.answer_callback_query(call.id, "✅ User updated successfully.")

    text = get_user_info_text(
        status=user.status,
        username=user.username,
        sub_url=user.subscription_url,
        data_limit=user.data_limit,
        usage=user.used_traffic,
        expire=user.expire,
        note=user.note
    )
    await bot.edit_message_text(
        text,
        call.message.chat.id,
        call.message.message_id,
        parse_mode="HTML",
        reply_markup=BotKeyboard.user_menu({
            'username': db_user.username,
            'status': db_user.status},
            note=True)
    )
    if TELEGRAM_LOGGER_CHANNEL_ID:
        tag = f'\n➖➖➖➖➖➖➖➖➖ \n<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'
        if last_user.data_limit != user.data_limit:
            text = f'''\
📶 <b>#Traffic_Change #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{user.username}</code>
<b>Last Traffic Limit :</b> <code>{readable_size(last_user.data_limit) if last_user.data_limit else "Unlimited"}</code>
<b>New Traffic Limit :</b> <code>{readable_size(user.data_limit) if user.data_limit else "Unlimited"}</code>{tag}'''
            try:
                await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
            except:
                pass
        if last_user.expire != user.expire:
            text = f'''\
📅 <b>#Expiry_Change #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{user.username}</code>
<b>Last Expire Date :</b> <code>\
{datetime.fromtimestamp(last_user.expire).strftime('%H:%M:%S %Y-%m-%d') if last_user.expire else "Never"}</code>
<b>New Expire Date :</b> <code>\
{datetime.fromtimestamp(user.expire).strftime('%H:%M:%S %Y-%m-%d') if user.expire else "Never"}</code>{tag}'''
            try:
                await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
            except:
                pass
        if list(last_user.inbounds.values())[0] != list(user.inbounds.values())[0]:
            text = f'''\
⚙️ <b>#Inbounds_Change #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{user.username}</code>
<b>Last Proxies :</b> <code>{", ".join(list(last_user.inbounds.values())[0])}</code>
<b>New Proxies :</b> <code>{", ".join(list(user.inbounds.values())[0])}</code>{tag}'''
            try:
                await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
            except:
                pass



@bot.callback_query_handler(query_startswith("add_user_done"), is_admin=True)
async def delete_limpired(call: types.CallbackQuery):
    if mem_store.get(f'{call.message.chat.id}:username') is None:
        try:
            await bot.delete_message(call.message.chat.id,
                               call.message.message_id)
        except Exception:
            pass
        return await bot.send_message(
            call.message.chat.id,
            '❌ Bot reload detected. Please start over.',
            reply_markup=BotKeyboard.main_menu()
        )

    if not mem_store.get(f'{call.message.chat.id}:services'):
        return await bot.answer_callback_query(
            call.id,
            '❌ No services selected.',
            show_alert=True
        )

    services: List[int] = mem_store.get(f'{call.message.chat.id}:services', [])
    
    new_user = UserCreate(
        username=mem_store.get(f'{call.message.chat.id}:username'),
        expire=int(mem_store.get(f'{call.message.chat.id}:expire_date').timestamp())
        if mem_store.get(f'{call.message.chat.id}:expire_date') else None,
        data_limit=mem_store.get(f'{call.message.chat.id}:data_limit')
        if mem_store.get(f'{call.message.chat.id}:data_limit') else None,
        services=services)
    try:
        with GetDB() as db:
            db_user = crud.create_user(db, new_user)
            services = db_user.services
            user = UserResponse.model_validate(db_user)
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        return await bot.answer_callback_query(
            call.id,
            '❌ Username already exists.',
            show_alert=True
        )

    await xray.operations.add_user(db_user)

    text = get_user_info_text(
        status=user.status,
        username=user.username,
        sub_url=user.subscription_url,
        data_limit=user.data_limit,
        usage=user.used_traffic,
        expire=user.expire,
        note=user.note
    )
    await bot.edit_message_text(
        text,
        call.message.chat.id,
        call.message.message_id,
        parse_mode="HTML",
        reply_markup=BotKeyboard.user_menu(user_info={'status': user.status, 'username': user.username}, note=True))

    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
🆕 <b>#Created #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username :</b> <code>{user.username}</code>
<b>Traffic Limit :</b> <code>{readable_size(user.data_limit) if user.data_limit else "Unlimited"}</code>
<b>Expire Date :</b> <code>\
{datetime.fromtimestamp(user.expire).strftime('%H:%M:%S %Y-%m-%d') if user.expire else "Never"}</code>
<b>Services :</b> <code>{"" if not services else ", ".join([s.name for s in services])}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass


@bot.callback_query_handler(query_startswith(['do_delete_expired', 'do_delete_limited']), is_admin=True)
async def delete_limpired(call: types.CallbackQuery):
    await bot.edit_message_text(
        '⏳ <b>In Progress...</b>',
        call.message.chat.id,
        call.message.message_id,
        parse_mode="HTML")
    with GetDB() as db:
        depleted_users = crud.get_users(
            db, status=[UserStatus.limited if data == 'delete_limited' else UserStatus.expired])
        file_name = f'{data[8:]}_users_{int(now.timestamp()*1000)}.txt'
        with open(file_name, 'w') as f:
            f.write('USERNAME\tEXIPRY\tUSAGE/LIMIT\tSTATUS\n')
            deleted = 0
            for user in depleted_users:
                try:
                    crud.remove_user(db, user)
                    await xray.operations.remove_user(user)
                    deleted +=1
                    f.write(\
f'{user.username}\
\t{datetime.fromtimestamp(user.expire) if user.expire else "never"}\
\t{readable_size(user.used_traffic) if user.used_traffic else 0}\
/{readable_size(user.data_limit) if user.data_limit else "Unlimited"}\
\t{user.status}\n')
                except:
                    db.rollback()
        await bot.edit_message_text(
            f'✅ <code>{deleted}</code>/<code>{len(depleted_users)}</code> <b>{data[7:].title()} Users Deleted</b>',
            call.message.chat.id,
            call.message.message_id,
            parse_mode="HTML",
            reply_markup=BotKeyboard.main_menu())
        if TELEGRAM_LOGGER_CHANNEL_ID:
            text = f'''\
🗑 <b>#Delete #{data[7:].title()} #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Count:</b> <code>{deleted}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
            try:
                await bot.send_document(TELEGRAM_LOGGER_CHANNEL_ID, open(file_name, 'rb'), caption=text, parse_mode='HTML')
                os.remove(file_name)
            except:
                pass

@bot.callback_query_handler(query_startswith('do_add_data:'), is_admin=True)
async def add_data_to_all(call: types.CallbackQuery):
    schedule_delete_message(
        call.message.chat.id,
        (await bot.send_message(chat_id, '⏳ <b>In Progress...</b>', 'HTML')).id)
    data_limit = float(call.data.split(":")[1]) * 1024 * 1024 * 1024
    with GetDB() as db:
        users = crud.get_users(db)
        counter = 0
        file_name = f'new_data_limit_users_{int(now.timestamp()*1000)}.txt'
        with open(file_name, 'w') as f:
            f.write('USERNAME\tEXIPRY\tUSAGE/LIMIT\tSTATUS\n')
            for user in users:
                try:
                    if user.data_limit and user.status not in [UserStatus.limited, UserStatus.expired]:
                        user = crud.update_user(db, user, UserModify(username=user.username, data_limit=(user.data_limit + data_limit)))
                        counter += 1
                        f.write(
                            f'{user.username}\
\t{datetime.fromtimestamp(user.expire) if user.expire else "never"}\
\t{readable_size(user.used_traffic) if user.used_traffic else 0}\
/{readable_size(user.data_limit) if user.data_limit else "Unlimited"}\
\t{user.status}\n')
                except:
                    db.rollback()
        await cleanup_messages(chat_id)
        await bot.send_message(
            chat_id,
            f'✅ <b>{counter}/{len(users)} Users</b> Data Limit according to <code>{"+" if data_limit > 0 else "-"}{readable_size(abs(data_limit))}</code>',
            'HTML',
            reply_markup=BotKeyboard.main_menu())
        if TELEGRAM_LOGGER_CHANNEL_ID:
            text = f'''\
📶 <b>#Traffic_Change #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>According to:</b> <code>{"+" if data_limit > 0 else "-"}{readable_size(abs(data_limit))}</code>
<b>Count:</b> <code>{counter}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
            try:
                await bot.send_document(TELEGRAM_LOGGER_CHANNEL_ID, open(file_name, 'rb'), caption=text, parse_mode='HTML')
                os.remove(file_name)
            except:
                pass

@bot.callback_query_handler(query_startswith('do_add_time:'), is_admin=True)
async def add_time_to_all(call: types.CallbackQuery):
    schedule_delete_message(
        call.message.chat.id,
        (await bot.send_message(chat_id, '⏳ <b>In Progress...</b>', 'HTML')).id)
    days = int(call.data.split(":")[1])
    with GetDB() as db:
        users = crud.get_users(db)
        counter = 0
        file_name = f'new_expiry_users_{int(now.timestamp()*1000)}.txt'
        with open(file_name, 'w') as f:
            f.write('USERNAME\tEXIPRY\tUSAGE/LIMIT\tSTATUS\n')
            for user in users:
                try:
                    if user.expire and user.status not in [UserStatus.limited, UserStatus.expired]:
                        user = crud.update_user(
                            db, user,
                            UserModify(
                                username=user.username,
                                expire=int(
                                    (datetime.fromtimestamp(user.expire) + relativedelta(days=days)).timestamp())))
                        counter += 1
                        f.write(
                            f'{user.username}\
\t{datetime.fromtimestamp(user.expire) if user.expire else "never"}\
\t{readable_size(user.used_traffic) if user.used_traffic else 0}\
/{readable_size(user.data_limit) if user.data_limit else "Unlimited"}\
\t{user.status}\n')
                except:
                    db.rollback()
        await cleanup_messages(chat_id)
        await bot.send_message(
            chat_id,
            f'✅ <b>{counter}/{len(users)} Users</b> Expiry Changes according to {days} Days',
            'HTML',
            reply_markup=BotKeyboard.main_menu())
        if TELEGRAM_LOGGER_CHANNEL_ID:
            text = f'''\
📅 <b>#Expiry_Change #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>According to:</b> <code>{days} Days</code>
<b>Count:</b> <code>{counter}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
            try:
                await bot.send_document(TELEGRAM_LOGGER_CHANNEL_ID, open(file_name, 'rb'), caption=text, parse_mode='HTML')
                os.remove(file_name)
            except:
                pass

@bot.callback_query_handler(query_startswith('do_revoke:'), is_admin=True)
async def revoke_sub(call: types.CallbackQuery):
    username = call.data.split(":")[1]
    with GetDB() as db:
        db_user = crud.get_user(db, username)
        if not db_user:
            return await bot.answer_callback_query(call.id, text=f"User not found!", show_alert=True)
        db_user = crud.revoke_user_sub(db, db_user)
        user = UserResponse.model_validate(db_user)
    text = get_user_info_text(
        status=user.status,
        username=user.username,
        sub_url=user.subscription_url,
        expire=user.expire,
        data_limit=user.data_limit,
        usage=user.used_traffic,
        note=user.note)
    await bot.edit_message_text(
            f'✅ Subscription Successfully Revoked!\n\n{text}',
            call.message.chat.id,
            call.message.message_id,
            parse_mode="HTML",
            reply_markup=BotKeyboard.user_menu(user_info={'status': user.status, 'username': user.username}, note=True))

    if TELEGRAM_LOGGER_CHANNEL_ID:
        text = f'''\
🚫 <b>#Revoke_sub #From_Bot</b>
➖➖➖➖➖➖➖➖➖
<b>Username:</b> <code>{username}</code>
➖➖➖➖➖➖➖➖➖
<b>By :</b> <a href="tg://user?id={call.from_user.id}">{call.from_user.full_name}</a>'''
        try:
            await bot.send_message(TELEGRAM_LOGGER_CHANNEL_ID, text, 'HTML')
        except:
            pass


@bot.message_handler(func=lambda message: True, is_admin=True)
async def search(message: types.Message):
    with GetDB() as db:
        db_user = crud.get_user(db, message.text)
        if not db_user:
            return await bot.reply_to(message, '❌ User not found.')
        user = UserResponse.model_validate(db_user)
    text = get_user_info_text(
        status=user.status,
        username=user.username,
        sub_url=user.subscription_url,
        expire=user.expire,
        data_limit=user.data_limit,
        usage=user.used_traffic,
        note=user.note)
    return await bot.reply_to(message, text, parse_mode="html", reply_markup=BotKeyboard.user_menu(user_info={
        'status': user.status,
        'username': user.username
    }, note=True))
