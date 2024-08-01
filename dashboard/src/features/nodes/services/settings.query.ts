import type { NodeType } from "@marzneshin/features/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

type NodesSettingsQueryKey = [string, number, string, string];

interface NodesSettingsQuery {
    queryKey: NodesSettingsQueryKey;
}

export async function fetchNodesSettings({
    queryKey,
}: NodesSettingsQuery): Promise<string> {
    return fetch(`/nodes/${Number(queryKey[1])}/${queryKey[2]}/config`).then(
        (config) => {
            return config;
        },
    );
}

export const NodesSettingsQueryFetchKey = "nodes";

export const useNodesSettingsQuery = (node: NodeType, backend: string) => {
    const queryKey: NodesSettingsQueryKey = [
        NodesSettingsQueryFetchKey,
        node.id,
        backend,
        "config",
    ];

    return useQuery({
        queryKey,
        queryFn: fetchNodesSettings,
        initialData: "",
    });
};
