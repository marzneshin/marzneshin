import { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SectionWidget,
    ChartContainer,
    Awaiting,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@marzneshin/common/components";
import { XAxis, BarChart, YAxis, CartesianGrid, Bar } from "recharts"
import { format as formatByte } from '@chbphone55/pretty-bytes';
import { useNodesUsageQuery, NodeType } from "@marzneshin/modules/nodes";
import {
    useTransformDateUsageData,
    ChartDateInterval,
    SelectDateView,
    dateXAxisTicks,
    useFromNowInterval
} from "@marzneshin/libs/stats-charts";

const chartConfig = {
    traffic: {
        label: "Traffic",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export const NodesUsageWidget: FC<{ node: NodeType }> = ({ node }) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState("1d")
    const { start, end } = useFromNowInterval(timeRange as ChartDateInterval);
    const { data } = useNodesUsageQuery({ nodeId: node.id, start, end })
    const chartData = useTransformDateUsageData(data.usages);
    const [totalAmount, totalMetric] = formatByte(data.total);

    return (
        <Awaiting
            Component={
                <SectionWidget
                    title={
                        <div className="hstack justify-between w-full">
                            {t("page.nodes.nodes-usage-widget.title")}
                        </div>
                    }
                    description={t("page.nodes.nodes-usage-widget.desc")}
                    options={
                        <div className="vstack justify-end w-full">
                            <span className="text-lg leading-none sm:text-2xl w-full">
                                {totalAmount} {totalMetric}
                            </span>
                            <span className="text-sm flex justify-end  text-muted-foreground w-full">
                                Total
                            </span>
                        </div>
                    }
                    footer={
                        <SelectDateView timeRange={timeRange} setTimeRange={setTimeRange} />
                    }
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
                                top: 13,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => {
                                    const [amount, metric] = formatByte(value)
                                    return `${amount} ${metric}`
                                }}
                            />
                            <XAxis
                                dataKey="datetime"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => dateXAxisTicks(value, timeRange as ChartDateInterval)}
                            />
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
        />
    );
};
