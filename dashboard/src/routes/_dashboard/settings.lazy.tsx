
import { Card, CardContent, CardHeader, CardTitle, Page, VStack } from '@marzneshin/components'
import { CertificateWidget, ConfigurationWidget } from '@marzneshin/features/settings';
import { SubscriptionRulesWidget } from '@marzneshin/features/subscription-settings';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next'

export const Settings = () => {
    const { t } = useTranslation()
    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('settings')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="sm:flex flex-col lg:grid grid-cols-2 gap-3 h-full">
                    <ConfigurationWidget />
                    <VStack className="gap-3">
                        <SubscriptionRulesWidget />
                        <CertificateWidget />
                    </VStack>
                </CardContent>
            </Card>
        </Page>
    )
}

export const Route = createFileRoute('/_dashboard/settings')({
    component: () => <Settings />
})
