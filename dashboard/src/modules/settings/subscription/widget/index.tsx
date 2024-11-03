import {
    SectionWidget
} from "@marzneshin/common/components";
import { SubscriptionRulesForm } from "@marzneshin/modules/settings/subscription";
import { useTranslation } from "react-i18next";

export const SubscriptionSettingsWidget = () => {
    const { t } = useTranslation()
    return (
        <SectionWidget
            title={t("page.settings.subscription-settings.title")}
            description={t("page.settings.subscription-settings.description")}
            content={<SubscriptionRulesForm />}
        />
    )
}
