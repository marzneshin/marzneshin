import { createLazyFileRoute } from '@tanstack/react-router'
import { Page } from '@marzneshin/common/components'
import { UsersStatsWidget, useUsersStatsQuery } from '@marzneshin/modules/users'
import { TotalTrafficsWidget } from '@marzneshin/features/total-traffic-widget'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'

export const DashboardPage: FC = () => {
  const { t } = useTranslation()
  const { data } = useUsersStatsQuery()

  return (
    <Page className="flex flex-col gap-4 w-full" title={t('home')}>
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-4`}>
        <div className={data.total !== 0 ? 'md:col-span-8' : 'md:col-span-12'}>
          <TotalTrafficsWidget />
        </div>

        {data.total !== 0 && (
          <div className="md:col-span-4">
            <UsersStatsWidget {...data} />
          </div>
        )}
      </div>
    </Page>
  )
}

export const Route = createLazyFileRoute('/_dashboard/')({
  component: () => <DashboardPage />,
})
