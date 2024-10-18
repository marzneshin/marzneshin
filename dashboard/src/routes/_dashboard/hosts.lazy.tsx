import {
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
        <Page title={t('hosts')}>
            <InboundHostsTable />
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </Page>
    )
}

export const Route = createFileRoute('/_dashboard/hosts')({
    component: () => <SudoRoute><HostsPage /></SudoRoute>
})
