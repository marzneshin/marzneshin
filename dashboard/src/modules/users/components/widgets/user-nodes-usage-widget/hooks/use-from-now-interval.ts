import { ChartDateInterval } from "../types";

export function useFromNowInterval(interval: ChartDateInterval) {
    const start = new Date();
    const end = new Date();
    start.setDate(end.getDate() - parseInt(interval.replace("d", "")));
    end.setMinutes(0, 0, 0);
    start.setMinutes(0, 0, 0);
    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}
