import {
    Page,
    Loading,
} from '@marzneshin/components';
import { SudoRoute } from '@marzneshin/features/sudo-routes'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminsTable } from '@marzneshin/modules/admins'
import { type FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

export const AdminsPage: FC = () => {
    const { t } = useTranslation();
    return (
        <Page title={t('admins')}>
            <AdminsTable />
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </Page>
    )
};


export const Route = createFileRoute('/_dashboard/admins')({
    component: () => <SudoRoute><AdminsPage /></SudoRoute>,
})
