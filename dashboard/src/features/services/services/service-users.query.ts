import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { UserType } from "@marzneshin/features/users";

interface FetchServiceUsersType {
    queryKey: [string, number, number, number]
}

interface UseServiceUsersQueryProps {
    serviceId: number;
    page?: number;
    size?: number;
}

export async function fetchServiceUsers({ queryKey }: FetchServiceUsersType): Promise<UserType[]> {
    return fetch(`/services/${queryKey[1]}/users`, {
        query: {
            page: queryKey[2],
            size: queryKey[3]
        }
    }).then((result) => {
        return result.items;
    });
}

const ServicesQueryFetchKey = "services";

export const useUsersServiceQuery = ({
    serviceId, page = 1, size = 50
}: UseServiceUsersQueryProps) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, serviceId, page, size],
        queryFn: fetchServiceUsers,
        initialData: []
    })
}
