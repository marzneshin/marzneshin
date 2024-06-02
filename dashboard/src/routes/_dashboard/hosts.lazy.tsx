import { Card, CardContent, CardFooter, CardHeader, CardTitle, Page } from '@marzneshin/components'
import { InboundHostsTable } from '@marzneshin/features/hosts'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const HostsPage = () => {
    const { t } = useTranslation()
    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('hosts')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <InboundHostsTable />
                    <Outlet />
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </Page>
    )
}

export const Route = createFileRoute('/_dashboard/hosts')({
    component: () => <HostsPage />
})
