
import { Card, CardContent, CardHeader, CardTitle } from '@marzneshin/components'
import { CertificateButton } from '@marzneshin/features/settings'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Settings = () => {
    const { t } = useTranslation()
    return (
        <Card className="m-3">
            <CardContent>
                <CardHeader>
                    <CardTitle>
                        {t('settings')}
                    </CardTitle>
                </CardHeader>
                <CertificateButton />
            </CardContent>
        </Card>
    )
}

export const Route = createFileRoute('/_dashboard/settings')({
    component: () => <Settings />
})
