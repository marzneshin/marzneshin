
import { Card, CardContent, CardHeader, CardTitle, Page, VStack } from '@marzneshin/components'
import { CertificateWidget } from '@marzneshin/features/settings';
import { SubscriptionSettingsWidget } from '@marzneshin/features/subscription-settings';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next'
import { SudoRoute } from "@marzneshin/features/sudo-routes";

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
                    {/* <ConfigurationWidget /> */}
                    <VStack className="gap-3">
                        <SubscriptionSettingsWidget />
                        <CertificateWidget />
                    </VStack>
                </CardContent>
            </Card>
        </Page>
    )
}

export const Route = createFileRoute('/_dashboard/settings')({
    component: () => <SudoRoute> <Settings /> </SudoRoute>
})
