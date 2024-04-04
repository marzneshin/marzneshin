import {
  Alert,
  AlertDescription,
  AlertTitle,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Page
} from '@marzneshin/components';
import { NodesTable } from '@marzneshin/features/nodes';
import { Link, createFileRoute } from '@tanstack/react-router'
import { Info } from 'lucide-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const NodesPage: FC = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <Card>
        <CardHeader>
          <CardTitle>
            {t('nodes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NodesTable />
        </CardContent>
        <CardFooter>
          <Alert>
            <Info className="mr-2" />
            <AlertTitle className="font-semibold text-primary">{t('page.nodes.certificate-alert.title')}</AlertTitle>
            <AlertDescription>
              {t('page.nodes.certificate-alert.desc')}
              <Link className="m-1 font-semibold text-secondary-foreground" to="/settings">{t('page.nodes.certificate-alert.click')}</Link>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card >
    </Page>
  )
};

export const Route = createFileRoute('/_dashboard/nodes')({
  component: () => <NodesPage />
})
