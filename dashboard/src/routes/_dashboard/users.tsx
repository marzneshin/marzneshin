import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@marzneshin/components';
import { UsersTable } from '@marzneshin/features/users';
import { createFileRoute } from '@tanstack/react-router'
import { FC } from 'react';
import { useTranslation } from 'react-i18next';


export const UsersPage: FC = () => {
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
      </CardFooter>
    </Card >
  )
};


export const Route = createFileRoute('/_dashboard/users')({
  component: () => <UsersPage />
})
