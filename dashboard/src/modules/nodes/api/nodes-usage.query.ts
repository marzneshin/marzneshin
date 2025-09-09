import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";
import { sumTraffic } from "@marzneshin/common/utils/traffic";

export type UsageMetric = number[];

export interface NodesUsageResponse {
    usages: Array<UsageMetric>;
    total: number;
}

export interface NodesUsageQueryOptions {
    nodeId: number;
    start: string | undefined;
    end: string;
}

export type NodesUsageQueryKey = [string, number, string, { start?: string, end?: string }]

export const NodesUsageDefault = {
    total: 0,
    usages: []
}

export async function fetchNodesUsage({ queryKey }: { queryKey: NodesUsageQueryKey }): Promise<NodesUsageResponse> {
    return await fetch(`/nodes/${queryKey[1]}/usage`, {
        query: {
            ...(queryKey[3].start && { start: queryKey[3].start }),
            end: queryKey[3].end
        }
    }).then((result) => {
        return sumTraffic(result.usages, Math.floor(queryKey[3].start && (new Date(queryKey[3].end ?? '').getTime() - new Date(queryKey[3].start ?? '').getTime()) / 1000 / 24 || 1296000));
    });
}
export const useNodesUsageQuery = ({ nodeId, start, end }: NodesUsageQueryOptions) => {
    return useQuery({
        queryKey: ["nodes", nodeId, "usage", { start, end }],
        queryFn: fetchNodesUsage,
        refetchInterval: 1000 * 60 * 5, // 60min refresh
        initialData: NodesUsageDefault
    })
}
