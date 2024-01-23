from datetime import datetime as dt
from itertools import islice
from typing import Literal, Dict, List

from telebot import types  # noqa

from app import xray
from app.utils.system import readable_size


def chunk_dict(data: dict, size: int = 2):
    it = iter(data)
    for i in range(0, len(data), size):
        yield {k: data[k] for k in islice(it, size)}


class BotKeyboard:

    @staticmethod
    def main_menu():
        keyboard = types.InlineKeyboardMarkup()
        keyboard.add(
            types.InlineKeyboardButton(text='🔁 System Info', callback_data='system'),
            types.InlineKeyboardButton(text='♻️ Restart Xray', callback_data='restart'))
        keyboard.add(
            types.InlineKeyboardButton(text='👥 Users', callback_data='users:1'),
            types.InlineKeyboardButton(text='✏️ Edit All Users', callback_data='edit_all'))
        #keyboard.add(
        #    types.InlineKeyboardButton(text='➕ Create User From Template', callback_data='template_add_user'))
        keyboard.add(
            types.InlineKeyboardButton(text='➕ Create User', callback_data='add_user'))
        return keyboard


    @staticmethod
    def edit_all_menu():
        keyboard = types.InlineKeyboardMarkup()
        keyboard.add(
            types.InlineKeyboardButton(text='🗑 Delete Expired', callback_data='delete_expired'),
            types.InlineKeyboardButton(text='🗑 Delete Limited', callback_data='delete_limited'))
        keyboard.add(
            types.InlineKeyboardButton(text='🔋 Data (➕|➖)', callback_data='add_data'),
            types.InlineKeyboardButton(text='📅 Time (➕|➖)', callback_data='add_time'))
        #keyboard.add(
        #    types.InlineKeyboardButton(text='➕ Add Inbound', callback_data='inbound_add'),
        #    types.InlineKeyboardButton(text='➖ Remove Inbound', callback_data='inbound_remove'))
        keyboard.add(types.InlineKeyboardButton(text='🔙 Back', callback_data='cancel'))
        return keyboard


    #@staticmethod
    #def inbounds_menu(action, inbounds):
    #    keyboard = types.InlineKeyboardMarkup()
    #    for inbound in inbounds:
    #        keyboard.add(types.InlineKeyboardButton(text=inbound, callback_data=f'confirm_{action}:{inbound}'))
    #    keyboard.add(types.InlineKeyboardButton(text='🔙 Back', callback_data='cancel'))
    #    return keyboard


    @staticmethod
    def random_username(template_id: str = ''):
        keyboard = types.InlineKeyboardMarkup()

        keyboard.add(types.InlineKeyboardButton(
                text='🔡 Random Username',
                callback_data=f'random:{template_id}'))
        keyboard.add(types.InlineKeyboardButton(
                text='🔙 Cancel',
                callback_data='cancel'))
        return keyboard


    @staticmethod
    def user_menu(user_info, with_back: bool = True, page: int = 1, note: bool = False):
        keyboard = types.InlineKeyboardMarkup()
        keyboard.add(
            types.InlineKeyboardButton(
                text='❌ Disable' if user_info['status'] == 'active' else '✅ Activate',
                callback_data=f"{'suspend' if user_info['status'] == 'active' else 'activate'}:{user_info['username']}"
            ),
            types.InlineKeyboardButton(
                text='🗑 Delete',
                callback_data=f"delete:{user_info['username']}"
            ),
        )
        if note:
            keyboard.add(
                types.InlineKeyboardButton(
                    text='🚫 Revoke Sub',
                    callback_data=f"revoke_sub:{user_info['username']}"),
                types.InlineKeyboardButton(
                    text='✏️ Edit',
                    callback_data=f"edit:{user_info['username']}"))
            keyboard.add(
                types.InlineKeyboardButton(
                    text='📝 Edit Note',
                    callback_data=f"edit_note:{user_info['username']}"),
                types.InlineKeyboardButton(
                    text='📡 Links',
                    callback_data=f"links:{user_info['username']}"))
        else:
            keyboard.add(
                types.InlineKeyboardButton(
                    text='📡 Links',
                    callback_data=f"links:{user_info['username']}"),
                types.InlineKeyboardButton(
                    text='✏️ Edit',
                    callback_data=f"edit:{user_info['username']}"))
        keyboard.add(
            types.InlineKeyboardButton(
                text='🔁 Reset usage',
                callback_data=f"reset_usage:{user_info['username']}"
            ),
            types.InlineKeyboardButton(
                text='🔋 Charge',
                callback_data=f"charge:{user_info['username']}"
            )
        )
        if with_back:
            keyboard.add(
                types.InlineKeyboardButton(
                    text='🔙 Back',
                    callback_data=f'users:{page}'
                )
            )
        return keyboard

    @staticmethod
    def show_links(username: str):
        keyboard = types.InlineKeyboardMarkup()

        keyboard.add(
            types.InlineKeyboardButton(
                text="🖼 QR code",
                callback_data=f'genqr:{username}'
            )
        )
        keyboard.add(
            types.InlineKeyboardButton(
                text='🔙 Back',
                callback_data=f'user:{username}'
            )
        )
        return keyboard


    @staticmethod
    def subscription_page(sub_url: str):
        keyboard = types.InlineKeyboardMarkup()
        if sub_url[:4] == 'http':
            keyboard.add(types.InlineKeyboardButton(
                text='🚀 Subscription Page',
                url=sub_url))
        return keyboard


    @staticmethod
    def confirm_action(action: str, username: str = None):
        keyboard = types.InlineKeyboardMarkup()
        keyboard.add(
            types.InlineKeyboardButton(
                text='Yes',
                callback_data=f"{action}:{username}"
            ),
            types.InlineKeyboardButton(
                text='No',
                callback_data=f"cancel"
            )
        )
        return keyboard

    @staticmethod
    def inline_cancel_action(callback_data: str = "cancel"):
        keyboard = types.InlineKeyboardMarkup()
        keyboard.add(
            types.InlineKeyboardButton(
                text="🔙 Cancel",
                callback_data=callback_data
            )
        )
        return keyboard

    @staticmethod
    def user_list(users: list, page: int, total_pages: int):
        keyboard = types.InlineKeyboardMarkup()
        if len(users) >= 2:
            users = [p for p in users]
            users = [users[i:i + 2] for i in range(0, len(users), 2)]
        else:
            users = [users]
        for user in users:
            row = []
            for p in user:
                status = {
                    'active': '✅',
                    'expired': '🕰',
                    'limited': '📵',
                    'disabled': '❌'
                }
                row.append(types.InlineKeyboardButton(
                    text=f"{p.username} ({status[p.status]})",
                    callback_data=f'user:{p.username}:{page}'
                ))
            keyboard.row(*row)
        # if there is more than one page
        if total_pages > 1:
            if page > 1:
                keyboard.add(
                    types.InlineKeyboardButton(
                        text="⬅️ Previous",
                        callback_data=f'users:{page - 1}'
                    )
                )
            if page < total_pages:
                keyboard.add(
                    types.InlineKeyboardButton(
                        text="➡️ Next",
                        callback_data=f'users:{page + 1}'
                    )
                )
        keyboard.add(
            types.InlineKeyboardButton(
                text='🔙 Back',
                callback_data='cancel'
            )
        )
        return keyboard

    @staticmethod
    def select_services(services,
                        selected_services: List[int],
                        action: Literal["edit", "create"],
                        username: str = None,
                        data_limit: float = None,
                        expire_date: dt = None):
        
        keyboard = types.InlineKeyboardMarkup()

        if action == "edit":
            keyboard.add(
                types.InlineKeyboardButton(
                    text="⚠️ Data Limit:",
                    callback_data=f"help_edit"
                )
            )
            keyboard.add(
                types.InlineKeyboardButton(
                    text=f"{readable_size(data_limit) if data_limit else 'Unlimited'}",
                    callback_data=f"help_edit"
                ),
                types.InlineKeyboardButton(
                    text="✏️ Edit",
                    callback_data=f"edit_user:{username}:data"
                )
            )
            keyboard.add(
                types.InlineKeyboardButton(
                    text="📅 Expire Date:",
                    callback_data=f"help_edit"
                )
            )
            keyboard.add(
                types.InlineKeyboardButton(
                    text=f"{expire_date.strftime('%Y-%m-%d') if expire_date else 'Never'}",
                    callback_data=f"help_edit"
                ),
                types.InlineKeyboardButton(
                    text="✏️ Edit",
                    callback_data=f"edit_user:{username}:expire"
                )
            )
        for s in services:
            keyboard.add(
                    types.InlineKeyboardButton(
                        text=f"🌐 {s.name} {'✅' if s.id in selected_services else '❌'}",
                        callback_data=f"switch_service:{s.id}:{action}"
                        )
                    )
        keyboard.add(
            types.InlineKeyboardButton(
                text='Done',
                callback_data='edit_user_done' if action == "edit" else 'add_user_done'
            )
        )
        keyboard.add(
            types.InlineKeyboardButton(
                text='Cancel',
                callback_data=f'user:{username}' if action == "edit" else 'cancel'
            )
        )

        return keyboard
