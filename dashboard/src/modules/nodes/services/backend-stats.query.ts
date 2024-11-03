import type { NodeType } from "@marzneshin/modules/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";

type NodeBackendStatsQueryKey = [string, number, string, string];

interface NodeBackendStatsQuery {
    queryKey: NodeBackendStatsQueryKey;
}

export async function fetchNodeBackendStats({
    queryKey,
}: NodeBackendStatsQuery): Promise<{
    running: boolean;
} | null> {
    return fetch(`/nodes/${Number(queryKey[1])}/${queryKey[2]}/stats`)
        .then((stats) => stats)
        .catch(() => null);
}

export const useBackendStatsQuery = (node: NodeType, backend: string) => {
    const queryKey: NodeBackendStatsQueryKey = [
        "nodes",
        node.id,
        backend,
        "stats",
    ];

    return useQuery({
        queryKey,
        queryFn: fetchNodeBackendStats,
        refetchInterval: 1000 * 5,
        initialData: null,
    });
};
