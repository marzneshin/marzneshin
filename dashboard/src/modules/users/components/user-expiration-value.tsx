import { type FC } from 'react'
import { UserProp } from "@marzneshin/modules/users";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import advancedFormat from "dayjs/plugin/advancedFormat";

export const UserExpirationValue: FC<UserProp> = ({ user }) => {
    const { t } = useTranslation();

    dayjs.extend(relativeTime);
    dayjs.extend(advancedFormat);

    return ({
        start_on_first_use: user.usage_duration && `${(user.usage_duration / 86400)} Day`,
        fixed_date: user.expire_date && (dayjs(user.expire_date).format("MMMM Do, YYYY") + ' (' + dayjs(user.expire_date).fromNow()) + ')',
        never: t('never'),
    }[user.expire_strategy])
}

