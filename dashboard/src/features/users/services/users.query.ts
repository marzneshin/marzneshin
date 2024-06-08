import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UserType } from "../types";
import {
    FetchEntityReturn,
    UseEntityQueryProps,
    SortableEntitySortQueryProps,
    EntityQueryKeyType
} from "@marzneshin/components";

export type SortUserBy = "username" | "used_traffic" | "data_limit" | "expire" | "created_at"

export async function fetchUsers({ queryKey }: EntityQueryKeyType): FetchEntityReturn<UserType> {
    return fetch(`/users`, {
        query: {
            page: queryKey[1],
            size: queryKey[2],
            username: queryKey[3],
            descending: queryKey[5],
            order_by: queryKey[4]
        }
    }).then((result) => {
        return {
            entity: result.items,
            pageCount: result.pages
        };
    });
}

export const UsersQueryFetchKey = "users";

export const useUsersQuery = ({
    page, size, search = "", sortBy = "created_at", desc = false
}: UseEntityQueryProps & SortableEntitySortQueryProps) => {
    return useQuery({
        queryKey: [UsersQueryFetchKey, page, size, search, sortBy, desc],
        queryFn: fetchUsers,
        initialData: { entity: [], pageCount: 0 }
    })
}
