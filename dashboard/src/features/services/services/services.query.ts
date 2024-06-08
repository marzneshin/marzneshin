import { fetch } from "@marzneshin/utils";
import { ServiceType } from "../types";
import {
    EntityQueryKeyType,
    FetchEntityReturn,
    UseEntityQueryProps
} from "@marzneshin/components";
import { useQuery } from "@tanstack/react-query";

export async function fetchServices({ queryKey }: EntityQueryKeyType): FetchEntityReturn<ServiceType> {
    return fetch(`/services`, {
        query: {
            page: queryKey[1],
            size: queryKey[2]
        }
    }).then((result) => {
        const services: ServiceType[] = result.items;
        return {
            entity: services,
            pageCount: result.pages
        };
    });
}

export const ServicesQueryFetchKey = "services";

export const useServicesQuery = ({ page, size, search = ""}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, page, size, search],
        queryFn: fetchServices,
        initialData: { entity: [], pageCount: 0 }
    })
}
