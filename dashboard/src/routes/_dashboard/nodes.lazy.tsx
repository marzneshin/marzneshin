import { AlertCard, Page, Loading } from '@marzneshin/common/components'
import { NodesTable } from '@marzneshin/modules/nodes'
import { Link, createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { type FC, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { SudoRoute } from '@marzneshin/libs/sudo-routes'

export const NodesPage: FC = () => {
  const { t } = useTranslation()
  return (
    <Page
      title={t('nodes')}
      className="sm:w-screen md:w-full"
      footer={
        <AlertCard
          title={t('page.nodes.certificate-alert.title')}
          desc={
            <>
              {t('page.nodes.certificate-alert.desc')}
              <Link
                className="m-1 font-semibold text-secondary-foreground"
                to="/settings"
              >
                {t('page.nodes.certificate-alert.click')}
              </Link>
            </>
          }
        />
      }
    >
      <NodesTable />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </Page>
  )
}

export const Route = createLazyFileRoute('/_dashboard/nodes')({
  component: () => (
    <SudoRoute>
      {' '}
      <NodesPage />{' '}
    </SudoRoute>
  ),
})
