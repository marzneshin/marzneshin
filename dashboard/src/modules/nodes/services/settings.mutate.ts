import type { NodeType } from "@marzneshin/modules/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    type NodeBackendSettingConfigFormat,
    NodesSettingsQueryFetchKey,
} from "./settings.query";

interface UpdateNodesSettings {
    node: NodeType;
    backend: string;
    config: string;
    format: NodeBackendSettingConfigFormat;
}

export async function fetchUpdateNodesSettings({
    node,
    backend,
    config,
    format,
}: UpdateNodesSettings): Promise<NodeType> {
    return fetch(`/nodes/${node.id}/${backend}/config`, {
        method: "put",
        body: { config, format },
    }).then((node) => {
        return node;
    });
}

const handleError = (error: Error, value: UpdateNodesSettings) => {
    toast.error(i18n.t("events.update.error", { name: value.node.name }), {
        description: error.message,
    });
};

const handleSuccess = (value: NodeType) => {
    toast.success(i18n.t("events.update.success.title", { name: value.name }), {
        description: i18n.t("events.update.success.desc"),
    });
    queryClient.invalidateQueries({ queryKey: [NodesSettingsQueryFetchKey] });
};

const NodesSettingsUpdateFetchKey = ["nodes", "config"];

export const useNodesSettingsMutation = () => {
    return useMutation({
        mutationKey: NodesSettingsUpdateFetchKey,
        mutationFn: fetchUpdateNodesSettings,
        onError: handleError,
        onSuccess: handleSuccess,
    });
};
