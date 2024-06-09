import {
    MiniWidget
} from "@marzneshin/components";
import { SubscriptionRulesForm } from "@marzneshin/features/subscription-rules";
import  {useTranslation } from "react-i18next";

export const SubscriptionRulesWidget = () => {
    const { t } = useTranslation()
    return (
        <MiniWidget
            title={
                <div className="space-y-1">
                    <h4>
                       {t("page.settings.subscription-rules.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                       {t("page.settings.subscription-rules.desc")} 
                    </p>
                </div>
            }
        >
            <SubscriptionRulesForm />
        </MiniWidget>
    )
}
