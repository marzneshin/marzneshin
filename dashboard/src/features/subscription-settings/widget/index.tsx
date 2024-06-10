import {
    SectionWidget
} from "@marzneshin/components";
import { SubscriptionRulesForm } from "@marzneshin/features/subscription-settings";
import { useTranslation } from "react-i18next";

export const SubscriptionSettingsWidget = () => {
    const { t } = useTranslation()
    return (
        <SectionWidget
            title={
                <div className="space-y-1">
                    <h4>
                        {t("page.settings.subscription-settings.title")}
                    </h4>
                </div>
            }
        >
            <SubscriptionRulesForm />
        </SectionWidget>
    )
}
