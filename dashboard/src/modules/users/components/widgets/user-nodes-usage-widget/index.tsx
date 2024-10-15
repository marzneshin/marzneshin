import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SectionWidget,
    ChartLegendContent,
    ChartContainer,
    Awaiting,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from "@marzneshin/components";
import { Area, AreaChart, CartesianGrid, YAxis, XAxis } from "recharts"
import { useState } from "react";
import { SelectDateView } from "./select-date-view";
import { ChartDateInterval, UserNodesUsageWidgetProps } from "./types";
import { useChartConfig, useTransformData, useFromNowInterval } from "./hooks";
import { format as formatByte } from '@chbphone55/pretty-bytes';
import { useUserNodeUsagesQuery } from "@marzneshin/modules/users";
import { UsageGraphSkeleton } from "./skeleton"

export const UserNodesUsageWidget: FC<UserNodesUsageWidgetProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState("1d")
    const { start, end } = useFromNowInterval(timeRange as ChartDateInterval);
    const { data, isPending } = useUserNodeUsagesQuery({ username: user.username, start, end })
    const chartData = useTransformData(data);
    const config = useChartConfig(data);

    return (
        <Awaiting
            Component={
                <SectionWidget
                    title={<div className="hstack justify-between w-full">{t("page.users.settings.nodes-usage.title")} <SelectDateView timeRange={timeRange} setTimeRange={setTimeRange} /></div>}
                    description={t("page.users.settings.nodes-usage.desc")}
                >

                    <ChartContainer
                        className="aspect-auto h-[320px] w-full"
                        config={config}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 13,
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
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    const format: Intl.DateTimeFormatOptions = {
                                        "90d": {
                                            day: "numeric",
                                            month: "short",
                                        }, "30d": {
                                            day: "numeric",
                                        }, "7d": {
                                            day: "numeric",
                                            hour: "numeric",
                                        },
                                        "1d": {
                                            minute: "numeric",
                                            hour: "numeric",
                                        }
                                    }[timeRange as ChartDateInterval];
                                    if (timeRange === "1d") {
                                        return date.toLocaleTimeString("en-US", format);
                                    }

                                    return date.toLocaleDateString("en-US", format);
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        indicator='line'
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                        }}
                                        valueFormatter={(value) => {
                                            const [amount, metric] = formatByte(value as number)
                                            return `${amount} ${metric}`
                                        }}
                                    />
                                }
                            />
                            <defs>
                                {data.node_usages.map(node =>
                                    <linearGradient key={node.node_name} id={node.node_name} x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor={config[node.node_name].color}
                                            stopOpacity={0.1}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={config[node.node_name].color}
                                            stopOpacity={0.8}
                                        />
                                    </linearGradient>
                                )}
                            </defs>
                            {data.node_usages.map(node =>
                                <Area
                                    dataKey={node.node_name}
                                    key={node.node_name}
                                    type="natural"
                                    fill={config[node.node_name].color}
                                    fillOpacity={0.4}
                                    stackId={node.node_id}
                                    stroke={config[node.node_name].color}
                                />
                            )}
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ChartContainer>
                </SectionWidget>
            }
            Skeleton={<UsageGraphSkeleton />}
            isFetching={isPending}
        />
    );
};
