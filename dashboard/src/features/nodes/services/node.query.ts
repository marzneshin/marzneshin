import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import type { NodeType } from "../types";

export async function fetchNode({
    queryKey,
}: { queryKey: [string, number] }): Promise<NodeType> {
    console.log(queryKey)
    const res =  await fetch(`/nodes/${queryKey[1]}`).then(result => result);
    console.log(res)
    return res;
}

export const NodeQueryFetchKey = "nodes";

export const useNodeQuery = ({ nodeId }: { nodeId: number }) => {
    return useQuery({
        queryKey: [NodeQueryFetchKey, nodeId],
        queryFn: fetchNode,
        initialData: null,
    });
};
