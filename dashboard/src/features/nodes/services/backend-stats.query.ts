import type { NodeType } from "@marzneshin/features/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

type NodesSettingsQueryKey = [string, number, string, string];

interface NodesSettingsQuery {
    queryKey: NodesSettingsQueryKey;
}

export async function fetchNodeBackendStats({
    queryKey,
}: NodesSettingsQuery): Promise<{
    running: boolean;
} | null> {
    return fetch(`/nodes/${Number(queryKey[1])}/${queryKey[2]}/stats`)
        .then((stats) => stats)
        .catch(() => null);
}

export const useBackendStatsQuery = (node: NodeType, backend: string) => {
    const queryKey: NodesSettingsQueryKey = ["nodes", node.id, backend, "stats"];

    return useQuery({
        queryKey,
        queryFn: fetchNodeBackendStats,
        initialData: null,
    });
};
