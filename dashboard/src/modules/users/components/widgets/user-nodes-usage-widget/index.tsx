import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SectionWidget,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@marzneshin/components";
import { UserNodeUsagesResponse, useUserNodeUsagesQuery } from "@marzneshin/modules/users";
import mockData from "./mock-data.json";
import { Area, AreaChart, CartesianGrid, YAxis, XAxis } from "recharts"
import { useState } from "react";
import { SelectDateView } from "./select-date-view";
import { UserNodesUsageWidgetProps } from "./types";
import { useChartConfig, useTransformData } from "./hooks";


export const UserNodesUsageWidget: FC<UserNodesUsageWidgetProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState("90d")
    // const { start, end } = useStartEndDateFromNow(timeRange as ChartDateInterval);
    // const { data, isLoading } = useUserNodeUsagesQuery({ username: user.username, start, end })
    const chartData = useTransformData(mockData);
    const config = useChartConfig(mockData);

    return (
        <SectionWidget
            title={t("page.users.settings.nodes-usage.title")}
            description={t("page.users.settings.nodes-usage.desc")}
            footer={<SelectDateView timeRange={timeRange} setTimeRange={setTimeRange} />}
        >
            <ChartContainer
                className="aspect-auto h-[250px] w-full"
                config={config}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="datetime"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => {
                            const date = new Date(value)
                            return date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })
                        }}
                    />
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                labelFormatter={(value) => {
                                    return new Date(value).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                }}
                            />
                        }
                    />
                    <defs>
                        {mockData.node_usages.map(node =>
                            <linearGradient id={node.node_name} x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={config[node.node_name].color}
                                    stopOpacity={0.9}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={config[node.node_name].color}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        )}
                    </defs>
                    {mockData.node_usages.map(node =>
                        <Area
                            dataKey={node.node_name}
                            type="natural"
                            fill={`url(#${node.node_name})`}
                            fillOpacity={0.4}
                            stackId="a"
                            stroke={config[node.node_name].color}
                        />
                    )}
                </AreaChart>
            </ChartContainer>
        </SectionWidget>
    );
};
