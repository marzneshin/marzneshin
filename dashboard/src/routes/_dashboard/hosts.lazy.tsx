import { Page, Loading } from '@marzneshin/common/components'
import { InboundHostsTable } from '@marzneshin/modules/hosts'
import { SudoRoute } from '@marzneshin/libs/sudo-routes'
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Suspense } from 'react'

export const HostsPage = () => {
  const { t } = useTranslation()
  return (
    <Page title={t('hosts')}>
      <InboundHostsTable />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}

export const Route = createLazyFileRoute('/_dashboard/hosts')({
  component: () => (
    <SudoRoute>
      <HostsPage />
    </SudoRoute>
  ),
})
