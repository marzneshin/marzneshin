import { ChartDateInterval } from "../types";

export function useFromNowInterval(interval: ChartDateInterval) {
    const start = new Date();
    const end = new Date();

    start.setDate(end.getDate() - parseInt(interval.replace("d", "")));
    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}
