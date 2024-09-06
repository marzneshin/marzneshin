import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { AdminType } from "@marzneshin/features/admins";
import {
    FetchEntityReturn,
    UseEntityQueryProps,
    EntityQueryKeyType
} from "@marzneshin/features/entity-table";

export async function fetchAdmins({ queryKey }: EntityQueryKeyType): FetchEntityReturn<AdminType> {
    const pagination = queryKey[1];
    const primaryFilter = queryKey[2];
    const filters = queryKey[4].filters;
    return fetch(`/admins`, {
        query: {
            ...pagination,
            ...filters,
            username: primaryFilter,
            descending: queryKey[3].desc,
            order_by: queryKey[3].sortBy,
        }
    }).then((result) => {
        return {
            entities: result.items,
            pageCount: result.pages
        };
    });
}

export const AdminsQueryFetchKey = "admins";

export const useAdminsQuery = ({
    page, size, sortBy = "created_at", desc = false, filters = {}
}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [AdminsQueryFetchKey, { page, size }, filters?.username ?? "", { sortBy, desc }, { filters }],
        queryFn: fetchAdmins,
        initialData: { entities: [], pageCount: 0 }
    })
}
