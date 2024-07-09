import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Page,
    Loading,
} from '@marzneshin/components';
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { type FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';

export const AdminsPage: FC = () => {
    const { t } = useTranslation();
    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('admins')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </CardContent>
            </Card>
        </Page>
    )
};


export const Route = createFileRoute('/_dashboard/admins')({
    component: () => <AdminsPage />,
})
