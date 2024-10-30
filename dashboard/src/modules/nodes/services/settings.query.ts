import type { NodeType } from "@marzneshin/modules/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";

type NodesSettingsQueryKey = [string, number, string, string];

export enum NodeBackendSettingConfigFormat {
    PLAIN = 0,
    JSON = 1,
    YAML = 2,
}

interface NodesSettingsQuery {
    queryKey: NodesSettingsQueryKey;
}

export async function fetchNodesSettings({
    queryKey,
}: NodesSettingsQuery): Promise<{
    config: string;
    format: NodeBackendSettingConfigFormat;
}> {
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
        initialData: { config: "", format: NodeBackendSettingConfigFormat.PLAIN },
    });
};
