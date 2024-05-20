import { MiniWidget } from '@marzneshin/components/stats-widgets';
import { UsersIcon } from 'lucide-react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { FC } from 'react';
import { useUsersStatsQuery } from '../../services/users-stats.query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UsersStatsLegend } from './legend'

const Header = () => {
    const { t } = useTranslation()
    return (
        <div className='flex flex-row justify-start items-center gap-3'>
            <UsersIcon />
            {t('users')}
        </div>
    )
}

type DataItem = { symbol: string, amount: number, color: string }

const Content = () => {
    const width = 200;
    const half = width / 2;
    const { data: stats } = useUsersStatsQuery()
    const [active, setActive] = useState<DataItem | null>(null);
    const { t } = useTranslation()

    const data: DataItem[] = [
        { symbol: "Active", amount: stats.active, color: "fill-blue-500" },
        { symbol: "Online", amount: stats.online, color: "fill-emerald-500" },
        { symbol: "Expired", amount: stats.expired, color: "fill-gray-600" },
        { symbol: "On Hold", amount: stats.on_hold, color: "fill-amber-500" },
        { symbol: "Limited", amount: stats.limited, color: "fill-red-500" },
    ];

    return (
        <div className='flex flex-row gap-5 justify-between'>
            <svg width={width} height={width}>
                <Group top={half} left={half}>
                    <Pie
                        data={data}
                        pieValue={(data) => data.amount}
                        outerRadius={half}
                        innerRadius={({ data }) => (active && (active.symbol === data.symbol) ? half - 14 : half - 8)}
                        padAngle={0.01}
                    >
                        {pie => {
                            return pie.arcs.map(arc => {
                                return (
                                    <g
                                        key={arc.data.symbol}
                                        onMouseEnter={() => setActive(arc.data)}
                                        onMouseLeave={() => setActive(null)}
                                    >
                                        <path d={pie.path(arc) ?? ''} className={arc.data.color}></path>
                                    </g>
                                )
                            })
                        }}
                    </Pie>
                    <Text
                        textAnchor="middle"
                        fontSize={30}
                        dy={-10}
                    >
                        {active ? active.amount : stats.total}
                    </Text>
                    <Text
                        textAnchor="middle"
                        fontSize={15}
                        dy={10}
                    >
                        {t('users')}
                    </Text>
                </Group>
            </svg>
            <UsersStatsLegend />
        </div >
    )
}

const Widget: FC = () => {
    return (
        <MiniWidget
            title={<Header />}
            content={<Content />}
        />
    )
}

export const UsersStatsWidget = Widget;
