
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";
import {
    FetchEntityReturn,
    UseEntityQueryProps,
    EntityQueryKeyType
} from "@marzneshin/libs/entity-table";
import { InboundType } from "../types";

export async function fetchInbounds({ queryKey }: EntityQueryKeyType): FetchEntityReturn<InboundType> {
    const pagination = queryKey[1];
    const primaryFilter = queryKey[2];
    const filters = queryKey[4].filters;
    return fetch(`/inbounds`, {
        query: {
            ...pagination,
            ...filters,
            tag: primaryFilter,
            descending: queryKey[3].desc,
            order_by: queryKey[3].sortBy,
        }
    }).then((result) => {
        return {
            entities: result.items,
            pageCount: result.pages
        };
    })
}

export const InboundsQueryFetchKey = "inbounds";

export const useInboundsQuery = ({
    page, size, sortBy = "created_at", desc = false, filters = {}
}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [InboundsQueryFetchKey, { page, size }, filters?.tag ?? "", { sortBy, desc }, { filters }],
        queryFn: fetchInbounds,
        initialData: { entities: [], pageCount: 0 }
    })
}
