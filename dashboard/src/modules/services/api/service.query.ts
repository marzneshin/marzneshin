import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";
import type { ServiceType } from "../types";

export async function fetchService({
    queryKey,
}: { queryKey: [string, number] }): Promise<ServiceType> {
    return await fetch(`/services/${queryKey[1]}`).then(result => {
        return {
            ...result,
            users: result.user_ids,
            inbounds: result.inbound_ids,
        };
    });
}

const ServiceQueryFetchKey = "services";

export const useServiceQuery = ({ serviceId }: { serviceId: number }) => {
    return useQuery({
        queryKey: [ServiceQueryFetchKey, serviceId],
        queryFn: fetchService,
        initialData: null,
    });
};
