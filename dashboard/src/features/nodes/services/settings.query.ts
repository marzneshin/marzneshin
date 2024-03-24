import { NodeType } from "@marzneshin/features/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

type NodesSettingsQueryKey = [string, number | null, string]

export async function fetchNodesSettings({ queryKey }: { queryKey: NodesSettingsQueryKey }): Promise<NodeType[]> {
    return fetch(`/nodes/${Number(queryKey[1])}/xray_config`).then((config) => {
        return config;
    });
}

export const NodesSettingsQueryFetchKey = "nodes";

export const useNodesSettingsQuery = (node: NodeType | null) => {
    const nodeId: number | null = node?.id ?? null
    const queryKey: NodesSettingsQueryKey =
        [NodesSettingsQueryFetchKey, nodeId, "xray_config"];

    const queryFn = nodeId !== null
        ? ({ queryKey }: { queryKey: [string, number | null, string] }) => fetchNodesSettings({ queryKey })
        : () => Promise.resolve<NodeType[]>([]);

    return useQuery({
        queryKey,
        queryFn,
        initialData: [],
    });
};
