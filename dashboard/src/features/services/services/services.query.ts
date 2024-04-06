import { fetch } from "@marzneshin/utils";
import { ServiceType } from "../types";
import {
    EntityQueryKeyType,
    FetchEntityReturn,
    UseEntityQueryProps
} from "@marzneshin/components";
import { useQuery } from "@tanstack/react-query";

interface ServiceResponse {
    id: number
    name: string
    users: any[]
    inbounds: any[]
    user_ids: number[]
    inbound_ids: number[]
}

export async function fetchServices({ queryKey }: EntityQueryKeyType): FetchEntityReturn<ServiceType> {
    return fetch(`/services?page=${queryKey[1]}&size=${queryKey[2]}`).then((result) => {
        const services: ServiceType[] = result.items.map((fetchedService: ServiceResponse) => {
            const service: ServiceType = fetchedService;
            service.users = fetchedService.user_ids
            service.inbounds = fetchedService.inbound_ids
            return service
        })
        return {
            entity: services,
            pageCount: result.pages
        };
    });
}

export const ServicesQueryFetchKey = "services";

export const useServicesQuery = ({ page, size }: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, page, size],
        queryFn: fetchServices,
        initialData: { entity: [], pageCount: 0 }
    })
}
