import type { NodeType } from "@marzneshin/modules/nodes";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";
import type {
    EntityQueryKeyType,
    UseEntityQueryProps,
    FetchEntityReturn
} from "@marzneshin/libs/entity-table";

export async function fetchNodes({
    queryKey,
}: EntityQueryKeyType): FetchEntityReturn<NodeType> {
    const pagination = queryKey[1];
    const primaryFilter = queryKey[2];
    const filters = queryKey[4].filters;
    return fetch('/nodes', {
        query: {
            ...pagination,
            ...filters,
            name: primaryFilter,
            descending: queryKey[3].desc,
            order_by: queryKey[3].sortBy,
        }
    }).then((result) => {
        return {
            entities: result.items,
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
        initialData: { entities: [], pageCount: 0 },
    });
};
