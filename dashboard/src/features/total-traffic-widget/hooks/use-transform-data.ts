import { UsageMetric } from "../api";

export type ChartDataEntry = {
    datetime: string;
    [key: string]: number | string;
};

export type ChartData = ChartDataEntry[];

export function useTransformData(usages: Array<UsageMetric>): ChartData {
    return usages.map(usageData => {
        const [timestamp, usage] = usageData;
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toISOString();
        return { datetime: formattedDate, traffic: usage };
    });
}
