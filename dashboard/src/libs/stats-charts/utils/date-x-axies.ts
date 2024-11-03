import { ChartDateInterval } from "../types";

export const dateXAxisTicks = (value: string, timeRange: ChartDateInterval) => {
    const date = new Date(value);
    const format = {
        "90d": {
            day: "numeric",
            month: "short",
        },
        "30d": {
            day: "numeric",
        },
        "7d": {
            day: "numeric",
            hour: "numeric",
        },
        "1d": {
            minute: "numeric",
            hour: "numeric",
        }
    }[timeRange as ChartDateInterval];

    if (timeRange === "1d") {
        return date.toLocaleTimeString("en-US", format as Intl.DateTimeFormatOptions);
    }

    return date.toLocaleDateString("en-US", format as Intl.DateTimeFormatOptions);
}
