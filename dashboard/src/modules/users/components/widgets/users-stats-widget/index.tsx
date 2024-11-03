import { FC } from 'react';
import { UsersIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    SectionWidget,
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@marzneshin/common/components";
import { Label, Pie, PieChart } from "recharts"

const chartConfig = {
    active: {
        label: "Active",
        color: "#3b82f6",
    },
    online: {
        label: "Online",
        color: "#10b981",
    },
    expired: {
        label: "Expired",
        color: "#4b5563",
    },
    onHold: {
        label: "On Hold",
        color: "#A855F7",
    },
    limited: {
        label: "Limited",
        color: "#ef4444",
    },
} satisfies ChartConfig;

interface UsersStatsProps {
    limited: number;
    active: number;
    expired: number;
    on_hold: number;
    online: number;
    total: number;
}

export const UsersStatsWidget: FC<UsersStatsProps> = ({ total, limited, active, expired, on_hold, online }) => {
    const { t } = useTranslation();

    const stats = [
        { type: "limited", total: limited, fill: "var(--color-limited)" },
        { type: "active", total: active, fill: "var(--color-active)" },
        { type: "expired", total: expired, fill: "var(--color-expired)" },
        { type: "onHold", total: on_hold, fill: "var(--color-onHold)" },
        { type: "online", total: online, fill: "var(--color-online)" },
    ]

    return (
        <SectionWidget
            title={<> <UsersIcon /> {t('users')} </>}
            description={t('page.home.users-stats.desc')}
            className="h-full"
        >
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square min-h-[300px]  w-full"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={stats}
                        dataKey="total"
                        nameKey="type"
                        innerRadius={60}
                        strokeWidth={5}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {total || 0}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                {t('users')}
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                    <ChartLegend className="flex -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/5 [&>*]:justify-center text-md" content={<ChartLegendContent />} />
                </PieChart>
            </ChartContainer>
        </SectionWidget>
    );
};

