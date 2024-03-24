import { NodeType } from "@marzneshin/features/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

export async function fetchNodes(): Promise<NodeType[]> {
    return fetch('/nodes').then((result) => {
        return result.items;
    });
}

export const NodesQueryFetchKey = "nodes";

export const useNodesQuery = () => {
    return useQuery({
        queryKey: [NodesQueryFetchKey],
        queryFn: fetchNodes,
        initialData: []
    })
}
