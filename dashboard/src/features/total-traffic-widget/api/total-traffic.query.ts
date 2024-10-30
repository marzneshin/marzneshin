import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";

export type UsageMetric = number[];

export interface TotalTrafficsResponse {
    usages: Array<UsageMetric>;
    total: number;
}

export interface TotalTrafficsQueryOptions {
    start: string;
    end: string
}

export type TotalTrafficsQueryKey = [string, string, string, { start?: string, end?: string }]

export const TotalTrafficsDefault = {
    total: 0,
    usages: []
}

export async function fetchTotalTraffics({ queryKey }: { queryKey: TotalTrafficsQueryKey }): Promise<TotalTrafficsResponse> {
    return await fetch(`/system/stats/traffic`, {
        query: {
            start: queryKey[3].start,
            end: queryKey[3].end
        }
    }).then((result) => {
        return result;
    });
}
export const useTotalTrafficQuery = ({ start, end }: TotalTrafficsQueryOptions) => {
    return useQuery({
        queryKey: ["system", "stats", "traffic", { start, end }],
        queryFn: fetchTotalTraffics,
        refetchInterval: 1000 * 60 * 5, // 60min refresh
        initialData: TotalTrafficsDefault
    })
}
