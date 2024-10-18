import { createFileRoute } from '@tanstack/react-router'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
        <Page>
            <Card className="border-0 sm:w-screen md:w-full shadow-none">
                <CardHeader>
                    <CardTitle>
                        {t('home')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex md:grid grid-cols-5 gap-4 w-full">
                    <div className="col-span-3">
                        <TotalTrafficsWidget />
                    </div>
                    <div className="col-span-2">
                        <UsersStatsWidget {...data} />
                    </div>
                </CardContent>
            </Card>
        </Page>
    )
};


export const Route = createFileRoute('/_dashboard/')({
    component: () => <DashboardPage />
})
