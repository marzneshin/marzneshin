import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import type { AdminType } from "../types";

export async function fetchAdmin({
    queryKey,
}: { queryKey: [string, string] }): Promise<AdminType> {
    return fetch(`/admins/${queryKey[1]}`);
}

export const AdminQueryFetchKey = "admins";

export const userQueryOptions = ({ username }: { username: string }) => {
    return queryOptions({
        queryKey: [AdminQueryFetchKey, username],
        queryFn: fetchAdmin,
        initialData: null,
    });
};

export const useAdminQuery = ({ username }: { username: string }) => {
    return useQuery({
        queryKey: [AdminQueryFetchKey, username],
        queryFn: fetchAdmin,
        initialData: null,
    });
};
