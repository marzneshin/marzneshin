import { NodeType } from "@marzneshin/modules/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { NodesQueryFetchKey } from "./nodes.query";

export async function fetchUpdateNode(node: NodeType): Promise<NodeType> {
    return fetch(`/nodes/${node.id}`, { method: 'put', body: node }).then((node) => {
        return node;
    });
}

const handleError = (error: ApiError, value: NodeType) => {
    handleApiErrorWithContext(error, {
        action: 'update',
        entityName: 'node',
        entityValue: value.name
    });
}

const handleSuccess = (value: NodeType) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.name }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [NodesQueryFetchKey] })
}


const NodesUpdateFetchKey = "nodes";

export const useNodesUpdateMutation = () => {
    return useMutation({
        mutationKey: [NodesUpdateFetchKey],
        mutationFn: fetchUpdateNode,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
