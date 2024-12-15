import { Page, Loading } from '@marzneshin/common/components'
import { UsersNoServiceAlert, UsersTable } from '@marzneshin/modules/users'
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { type FC, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

export const UsersPage: FC = () => {
  const { t } = useTranslation()

  return (
    <Page title={t('users')} footer={<UsersNoServiceAlert />}>
      <UsersTable />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}

export const Route = createLazyFileRoute('/_dashboard/users')({
  component: () => <UsersPage />,
})
