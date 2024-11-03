import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@marzneshin/common/components";
import { Info } from 'lucide-react';
import { useTranslation } from "react-i18next";

export const NoRulesAlert = () => {
    const { t } = useTranslation()
    return (
        <Alert>
            <Info className="mr-2" />
            <AlertTitle className="font-semibold text-primary">{t('page.settings.subscription-settings.alert.title')}</AlertTitle>
            <AlertDescription>
                {t('page.settings.subscription-settings.alert.desc')}
            </AlertDescription>
        </Alert>
    )
}
