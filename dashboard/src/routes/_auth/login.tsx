import { Card, CardContent, CardHeader, CardTitle } from '@marzneshin/common/components';
import { LoginForm, useAuth } from '@marzneshin/modules/auth';
import { createFileRoute } from '@tanstack/react-router'
import { FC } from 'react'
import { useTranslation } from 'react-i18next';

const LoginPage: FC = () => {
  const { t } = useTranslation();
  const { removeAuthToken } = useAuth()
  removeAuthToken()
  return (
    <div className='flex flex-row justify-center items-center p-4 w-full h-full'>
      <Card className="p-1 w-full md:w-2/3">
        <CardHeader>
          <CardTitle className="font-header text-primary">
            {t('login')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_auth/login')({
  component: () => <LoginPage />
})
