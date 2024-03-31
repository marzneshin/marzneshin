import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { ServiceType } from "../types";
import { UserType } from "@marzneshin/features/users";

export async function fetchUsersService({ queryKey }: { queryKey: [string, number] }): Promise<UserType[]> {
    return fetch(`/services/${queryKey[1]}`).then((result) => {
        return result.users;
    });
}

export const ServicesQueryFetchKey = "services";

export const useUsersServiceQuery = (service: ServiceType) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, service.id],
        queryFn: fetchUsersService,
        initialData: []
    })
}
