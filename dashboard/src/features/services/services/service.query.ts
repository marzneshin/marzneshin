import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import type { ServiceType } from "../types";

export async function fetchService({
    queryKey,
}: { queryKey: [string, number] }): Promise<ServiceType> {
    return await fetch(`/services/${queryKey[1]}`).then((result) => {
        return result;
    });
}

export const UserQueryFetchKey = "users";

export const useUserQuery = ({ serviceId }: { serviceId: number }) => {
    return useQuery({
        queryKey: [UserQueryFetchKey, serviceId],
        queryFn: fetchService,
        initialData: null,
    });
};
