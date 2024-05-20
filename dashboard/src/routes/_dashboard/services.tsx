import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Page
} from '@marzneshin/components'
import { ServicesTable } from '@marzneshin/features/services';
import { createFileRoute } from '@tanstack/react-router'
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const ServicesPage: FC = () => {
    const { t } = useTranslation();
    return (
        <Page>
            <Card className="border-0 sm:w-screen md:w-full">
                <CardHeader>
                    <CardTitle>
                        {t('services')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ServicesTable />
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card >
        </Page>
    )
};

export const Route = createFileRoute('/_dashboard/services')({
    component: () => <ServicesPage />
})
