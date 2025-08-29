import { NodeType, NodesQueryFetchKey } from "@marzneshin/modules/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateNode(node: NodeType): Promise<NodeType> {
    return fetch('/nodes', { method: 'post', body: node }).then((node) => {
        return node;
    });
}

const handleError = (error: ApiError, value: NodeType) => {
    handleApiErrorWithContext(error, {
        action: 'create',
        entityName: 'node',
        entityValue: value.name
    });
}

const handleSuccess = (value: NodeType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.name }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [NodesQueryFetchKey] })
}


const NodesCreateFetchKey = "nodes";

export const useNodesCreationMutation = () => {
    return useMutation({
        mutationKey: [NodesCreateFetchKey],
        mutationFn: fetchCreateNode,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
