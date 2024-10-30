import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";
import { UsersQueryFetchKey } from "../..";

type UsageMetric = number[];

interface NodeUsage {
    node_id: number;
    node_name: string;
    usages: Array<UsageMetric>;
}

export interface UserNodeUsagesResponse {
    username: string;
    total: number;
    node_usages: NodeUsage[];
}

export interface UserNodeUsagesQueryOptions {
    username: string;
    start?: string;
    end?: string
}

export type UserNodeUsagesQueryKey = [string, string, { start?: string, end?: string }]

export const UserNodeUsagesDefault = {
    username: "",
    node_usages: [],
    total: 0
}

export async function fetchUserNodeUsages({ queryKey }: { queryKey: UserNodeUsagesQueryKey }): Promise<UserNodeUsagesResponse> {
    return await fetch(`/users/${queryKey[1]}/usage`, {
        query: {
            start: queryKey[2].start,
            end: queryKey[2].end
        }
    }).then((result) => {
        return result;
    });
}

export const useUserNodeUsagesQuery = ({ username, start, end }: UserNodeUsagesQueryOptions) => {
    return useQuery({
        queryKey: [UsersQueryFetchKey, username, { start, end }],
        queryFn: fetchUserNodeUsages,
        refetchInterval: 1000 * 60 * 60, // 60min refresh
        initialData: UserNodeUsagesDefault
    })
}
