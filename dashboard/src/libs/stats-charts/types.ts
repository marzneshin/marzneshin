
export type UsageMetric = number[];

export type ChartDataEntry = {
    datetime: string;
    [key: string]: number | string;
};

export type ChartData = ChartDataEntry[];
export type ChartDateInterval = 'Total' | '90d' | '30d' | '7d' | '1d';
