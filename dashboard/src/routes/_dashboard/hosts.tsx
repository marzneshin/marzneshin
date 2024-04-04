import { Card, CardContent, CardFooter, CardHeader, CardTitle, Page } from '@marzneshin/components'
import { InboundHostsTable } from '@marzneshin/features/hosts'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const HostsPage = () => {
  const { t } = useTranslation()
  return (
    <Page>
      <Card>
        <CardHeader>
          <CardTitle>
            {t('hosts')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InboundHostsTable />
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>
    </Page>
  )
}

export const Route = createFileRoute('/_dashboard/hosts')({
  component: () => <HostsPage />
})
