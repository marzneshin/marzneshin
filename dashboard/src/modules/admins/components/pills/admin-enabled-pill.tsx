import { type FC } from "react";
import { BooleanPill } from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";
import { AdminProp } from "@marzneshin/modules/admins";

export const AdminEnabledPill: FC<AdminProp> = ({ admin }) => {
    const { t } = useTranslation();
    return (
        <BooleanPill
            active={admin.enabled}
            activeLabel={t('enabled')}
            inactiveLabel={t('disabled')}
        />
    )
}
