import { useServicesQuery } from '@marzneshin/features/services';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@marzneshin/components';

export const UsersNoServiceAlert = () => {
    const { t } = useTranslation();
    const { data } = useServicesQuery({ page: 1, size: 10 });
    return (data && data.pageCount === 0) && (
        <Alert>
            <ExclamationTriangleIcon className="mr-2" />
            <AlertTitle className="font-semibold text-primary">{t('page.users.services-alert.title')}</AlertTitle>
            <AlertDescription>
                {t('page.users.services-alert.desc')}
                <Link className="m-1 font-semibold text-secondary-foreground" to="/services">{t('page.nodes.certificate-alert.click')}</Link>
            </AlertDescription>
        </Alert>
    )
}

