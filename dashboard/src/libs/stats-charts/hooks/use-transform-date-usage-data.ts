import { UsageMetric, ChartData } from "../types";

export function useTransformDateUsageData(usages: Array<UsageMetric> | undefined): ChartData {
    // Handle undefined or null usages array
    if (!usages || !Array.isArray(usages)) {
        return [];
    }
    
    return usages.map(usageData => {
        const [timestamp, usage] = usageData;
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toISOString();
        return { datetime: formattedDate, traffic: usage };
    });
}
