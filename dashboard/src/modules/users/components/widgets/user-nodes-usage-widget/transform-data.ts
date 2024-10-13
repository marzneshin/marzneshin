import { UserNodeUsagesResponse } from "@marzneshin/modules/users";

type ChartDataEntry = {
    datetime: string;
    [key: string]: number | string;
};

type ChartData = ChartDataEntry[];

export function transformData(initialData: UserNodeUsagesResponse): ChartData {
    const chartData: ChartData = [];
    const nodeDataMap: { [date: string]: ChartDataEntry } = {};

    initialData.node_usages.forEach(node => {
        node.usages.forEach(usageData => {
            const [timestamp, usage] = usageData;
            const date = new Date(timestamp);
            const formattedDate = date.toISOString();

            if (!nodeDataMap[formattedDate]) {
                nodeDataMap[formattedDate] = { datetime: formattedDate };
            }
            nodeDataMap[formattedDate][node.node_name] = usage;
        });
    });

    for (const date in nodeDataMap) {
        chartData.push(nodeDataMap[date]);
    }
    console.log(chartData);
    return chartData;
}
