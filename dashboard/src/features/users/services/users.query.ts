import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UserType } from "../types";
import { EntityQueryKeyType, FetchEntityReturn, UseEntityQueryProps } from "@marzneshin/components";

interface UserResponse extends UserType {
    service_ids: number[]
    services: any[]
}

export async function fetchUsers({ queryKey }: EntityQueryKeyType): FetchEntityReturn<UserType> {
    return fetch(`/users?page=${queryKey[1]}&size=${queryKey[2]}&username=${queryKey[3]}`).then((result) => {
        const users: UserType[] = result.items.map((fetchedUser: UserResponse) => {
            const user: UserType = fetchedUser;
            user.services = fetchedUser.service_ids
            return user
        })
        return {
            entity: users,
            pageCount: result.pages
        };
    });
}

export const UsersQueryFetchKey = "users";

export const useUsersQuery = ({ page, size, search }: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [UsersQueryFetchKey, page, size, search ? search : ""],
        queryFn: fetchUsers,
        initialData: { entity: [], pageCount: 0 }
    })
}
