import { Alert, AlertDescription, AlertTitle, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@marzneshin/components';
import { useServicesQuery } from '@marzneshin/features/services';
import { UsersTable } from '@marzneshin/features/users';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Link, createFileRoute } from '@tanstack/react-router'
import { FC } from 'react';
import { useTranslation } from 'react-i18next';


export const UsersPage: FC = () => {
  const { data } = useServicesQuery();
  const { t } = useTranslation();
  return (
    <Card className="m-3">
      <CardHeader>
        <CardTitle>
          {t('users')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UsersTable />
      </CardContent>
      <CardFooter>
        {(data && data.length === 0) && (
          <Alert>
            <ExclamationTriangleIcon className="mr-2" />
            <AlertTitle className="font-semibold text-primary">{t('page.users.services-alert.title')}</AlertTitle>
            <AlertDescription>
              {t('page.users.services-alert.desc')}
              <Link className="m-1 font-semibold text-secondary-foreground" to="/services">{t('page.nodes.certificate-alert.click')}</Link>
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card >
  )
};


export const Route = createFileRoute('/_dashboard/users')({
  component: () => <UsersPage />
})
