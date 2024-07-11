import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { AdminType } from "@marzneshin/features/admins";
import {
    FetchEntityReturn,
    UseEntityQueryProps,
    EntityQueryKeyType
} from "@marzneshin/features/entity-table";

export async function fetchAdmins({ queryKey }: EntityQueryKeyType): FetchEntityReturn<AdminType> {
    return fetch(`/admins`, {
        query: {
            page: queryKey[1],
            size: queryKey[2],
            username: queryKey[3],
        }
    }).then((result) => {
        return {
            entity: result.items,
            pageCount: result.pages
        };
    });
}

export const AdminsQueryFetchKey = "users";

export const useAdminsQuery = ({
    page, size, search = ""
}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [AdminsQueryFetchKey, page, size, search],
        queryFn: fetchAdmins,
        initialData: { entity: [], pageCount: 0 }
    })
}
