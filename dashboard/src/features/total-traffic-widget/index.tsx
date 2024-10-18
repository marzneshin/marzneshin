import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SectionWidget,
    ChartContainer,
    Awaiting,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@marzneshin/components";
import { BarChart, CartesianGrid, Bar } from "recharts"
import { useTransformData, useFromNowInterval } from "./hooks";
import { format as formatByte } from '@chbphone55/pretty-bytes';
import { useTotalTrafficQuery } from "./api";
import { UsageGraphSkeleton } from "./components";
import { DateXAxis, ChartDateInterval, SelectDateView } from "@marzneshin/common/stats-charts";

const chartConfig = {
    traffic: {
        label: "Traffic",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export const TotalTrafficsWidget: FC = () => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState("1d")
    const { start, end } = useFromNowInterval(timeRange as ChartDateInterval);
    const { data, isPending } = useTotalTrafficQuery({ start, end })
    const chartData = useTransformData(data.usages);

    return (
        <Awaiting
            Component={
                <SectionWidget
                    title={
                        <div className="hstack justify-between w-full">
                            {t("page.home.total-traffics.title")}
                            <SelectDateView timeRange={timeRange} setTimeRange={setTimeRange} />
                        </div>
                    }
                    description={t("page.home.total-traffics.desc")}
                >
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[320px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <DateXAxis timeRange={timeRange as ChartDateInterval} />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        indicator='line'
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric"
                                            })
                                        }}
                                        valueFormatter={(value) => {
                                            const [amount, metric] = formatByte(value as number)
                                            return `${amount} ${metric}`
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="traffic" fill={`var(--color-traffic)`} />
                        </BarChart>
                    </ChartContainer>
                </SectionWidget>
            }
            Skeleton={<UsageGraphSkeleton />}
            isFetching={isPending}
        />
    );
};
