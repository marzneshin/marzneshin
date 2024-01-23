from app.telegram import bot
from typing import Union

from telebot import types, custom_filters
from telebot.asyncio_filters import AdvancedCustomFilter, StateFilter

from config import TELEGRAM_ADMIN_ID


class IsAdminFilter(AdvancedCustomFilter):
    key = 'is_admin'

    async def check(self, message, text):
        """
        :meta private:
        """
        if isinstance(message, types.CallbackQuery):
            return message.from_user.id in TELEGRAM_ADMIN_ID
        return message.chat.id in TELEGRAM_ADMIN_ID


def query_equals(text: str):
    return lambda query: query.data == text


def query_startswith(text: Union[list, str]):
    if type(text) is str:
        return lambda query: query.data.startswith(text)
    else:
        return lambda query: query.data.startswith(tuple(text))



def setup() -> None:
    bot.add_custom_filter(IsAdminFilter())
    bot.add_custom_filter(StateFilter(bot))
