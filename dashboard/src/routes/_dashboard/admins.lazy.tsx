import { Page, Loading } from '@marzneshin/common/components'
import { SudoRoute } from '@marzneshin/libs/sudo-routes'
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { AdminsTable } from '@marzneshin/modules/admins'
import { type FC, Suspense, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const AdminsPage: FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Page title={t('admins')}>
      <AdminsTable />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      {isLoading && <Loading />}
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
