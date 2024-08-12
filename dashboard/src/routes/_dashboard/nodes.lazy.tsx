import {
    AlertCard,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Page,
    Loading,
} from '@marzneshin/components';
import { NodesTable } from '@marzneshin/features/nodes';
import { Link, createFileRoute, Outlet } from '@tanstack/react-router'
import { type FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { SudoRoute } from "@marzneshin/features/sudo-routes";

export const NodesPage: FC = () => {
    const { t } = useTranslation();
    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('nodes')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <NodesTable />
                    <Suspense fallback={<Loading />}>
                        <Outlet />
                    </Suspense>
                </CardContent>
                <CardFooter>
                    <AlertCard
                        title={t('page.nodes.certificate-alert.title')}
                        desc={
                            <>
                                {t('page.nodes.certificate-alert.desc')}
                                <Link className="m-1 font-semibold text-secondary-foreground" to="/settings">{t('page.nodes.certificate-alert.click')}</Link>
                            </>
                        }
                    />
                </CardFooter>
            </Card >
        </Page>
    )
};

export const Route = createFileRoute('/_dashboard/nodes')({
    component: () => <SudoRoute> <NodesPage /> </SudoRoute>
})
