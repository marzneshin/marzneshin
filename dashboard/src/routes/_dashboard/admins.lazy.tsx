import { Page, Loading } from '@marzneshin/common/components'
import { SudoRoute } from '@marzneshin/libs/sudo-routes'
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { AdminsTable } from '@marzneshin/modules/admins'
import { type FC, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

export const AdminsPage: FC = () => {
  const { t } = useTranslation()
  return (
    <Page title={t('admins')}>
      <AdminsTable />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}

export const Route = createLazyFileRoute('/_dashboard/admins')({
  component: () => (
    <SudoRoute>
      <AdminsPage />
    </SudoRoute>
  ),
})
