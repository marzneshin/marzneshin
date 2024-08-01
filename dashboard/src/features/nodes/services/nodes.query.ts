import type { NodeType } from "@marzneshin/features/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import type {
    EntityQueryKeyType,
    UseEntityQueryProps,
} from "@marzneshin/features/entity-table";

export async function fetchNodes({
    queryKey,
}: EntityQueryKeyType): Promise<{ entity: NodeType[]; pageCount: number }> {
    return fetch(
        `/nodes?page=${queryKey[1]}&size=${queryKey[2]}&name=${queryKey[3]}`,
    ).then((result) => {
        return {
            entity: result.items,
            pageCount: result.pages,
        };
    });
}

export const NodesQueryFetchKey = "nodes";

export const useNodesQuery = ({ page, size, search }: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [NodesQueryFetchKey, page, size, search ? search : ""],
        queryFn: fetchNodes,
        initialData: { entity: [], pageCount: 0 },
    });
};
