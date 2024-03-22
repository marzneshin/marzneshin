import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@marzneshin/components';
import { NodesTable } from '@marzneshin/features/nodes';
import { createFileRoute } from '@tanstack/react-router'
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const NodesPage: FC = () => {
  const { t } = useTranslation();
  return (
    <Card className="m-3">
      <CardHeader>
        <CardTitle>
          {t('nodes')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <NodesTable />
      </CardContent>
      <CardFooter>
        Footer
      </CardFooter>
    </Card >)
};

export const Route = createFileRoute('/_dashboard/nodes')({
  component: () => <NodesPage />
})
