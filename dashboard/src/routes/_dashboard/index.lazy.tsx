import { createFileRoute } from '@tanstack/react-router'
import {
    Page,
} from '@marzneshin/components';
import { UsersStatsWidget, useUsersStatsQuery } from '@marzneshin/modules/users';
import { TotalTrafficsWidget } from '@marzneshin/features/total-traffic-widget';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

export const DashboardPage: FC = () => {
    const { t } = useTranslation();
    const { data } = useUsersStatsQuery()

    return (
        <Page className="flex md:grid grid-cols-5 gap-4 w-full" title={t('home')}>
            <div className="col-span-3">
                <TotalTrafficsWidget />
            </div>
            <div className="col-span-2">
                <UsersStatsWidget {...data} />
            </div>
        </Page>
    )
};


export const Route = createFileRoute('/_dashboard/')({
    component: () => <DashboardPage />
})
