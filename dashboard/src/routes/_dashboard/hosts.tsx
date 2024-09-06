import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Page,
    Loading,
} from '@marzneshin/components'
import { InboundHostsTable } from '@marzneshin/features/hosts'
import { SudoRoute } from '@marzneshin/features/sudo-routes'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react';

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
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </Page>
    )
}

export const Route = createFileRoute('/_dashboard/hosts')({
    component: () => <SudoRoute><HostsPage /></SudoRoute>
})
