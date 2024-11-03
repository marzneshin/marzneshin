import { AllowInsecureField, AlpnField, SniField } from "../fields";
import { SettingSection } from "@marzneshin/modules/hosts/components";
import { useTranslation } from "react-i18next";
import { FC } from 'react'

export const TlsFields: FC = () => {
    const { t } = useTranslation();
    return (
        <SettingSection value="tls-settings" triggerText={t("page.hosts.tls-config")}>
            <SniField />
            <AlpnField />
            <AllowInsecureField />
        </SettingSection>
    )
}
