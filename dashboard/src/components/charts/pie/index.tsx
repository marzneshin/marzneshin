import { FC, useState } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';

export type PieChartDataRecord = {
    symbol: string,
    amount: number,
    color: string
};

export interface PieChartProps {
    data: PieChartDataRecord[];
    width: number;
    height: number;
    total: number;
    label: string;
}

export const PieChart: FC<PieChartProps> = ({ data, width, height, total, label }) => {
    const half = width / 2;
    const [active, setActive] = useState<PieChartDataRecord | null>(null);

    return (
        <svg width={width} height={height}>
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
                    className='fill-primary'
                >
                    {active ? active.amount : total}
                </Text>
                <Text
                    textAnchor="middle"
                    fontSize={15}
                    dy={10}
                    className='fill-muted-foreground'
                >
                    {label}
                </Text>
            </Group>
        </svg>
    );
};
