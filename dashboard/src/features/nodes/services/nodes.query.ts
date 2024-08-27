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
    const pagination = queryKey[1];
    const primaryFilter = queryKey[2];
    const filters = queryKey[4].filters;
    return fetch(`/nodes`, {
        query: {
            ...pagination,
            ...filters,
            name: primaryFilter,
            descending: queryKey[3].desc,
            order_by: queryKey[3].sortBy,
        }
    }).then((result) => {
        return {
            entity: result.items,
            pageCount: result.pages,
        };
    });
}

export const NodesQueryFetchKey = "nodes";

export const useNodesQuery = ({
    page, size, sortBy = "created_at", desc = false, filters = {}
}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [NodesQueryFetchKey, { page, size }, filters?.username ?? "", { sortBy, desc }, { filters }],
        queryFn: fetchNodes,
        initialData: { entity: [], pageCount: 0 },
    });
};
