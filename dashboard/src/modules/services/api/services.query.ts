import { fetch } from "@marzneshin/common/utils";
import { ServiceType } from "../types";
import {
    EntityQueryKeyType,
    SelectableEntityQueryKeyType,
    FetchEntityReturn,
    UseEntityQueryProps
} from "@marzneshin/libs/entity-table";
import { useQuery } from "@tanstack/react-query";

export async function fetchServices({ queryKey }: EntityQueryKeyType): FetchEntityReturn<ServiceType> {
    const pagination = queryKey[1];
    const primaryFilter = queryKey[2];
    const filters = queryKey[4].filters;
    return fetch(`/services`, {
        query: {
            ...pagination,
            ...filters,
            name: primaryFilter,
            descending: queryKey[3].desc,
            order_by: queryKey[3].sortBy,
        }
    }).then((result) => {
        const services: ServiceType[] = result.items;
        return {
            entities: services,
            pageCount: result.pages
        };
    });
}

export async function fetchUserServices({ queryKey }: SelectableEntityQueryKeyType): FetchEntityReturn<ServiceType> {
    const pagination = queryKey[3];
    const primaryFilter = queryKey[4];
    const filters = queryKey[6].filters;
    return fetch(`/services`, {
        query: {
            ...pagination,
            ...filters,
            name: primaryFilter,
            descending: queryKey[5].desc,
            order_by: queryKey[5].sortBy,
        }
    }).then((result) => {
        const services: ServiceType[] = result.items;
        return {
            entities: services,
            pageCount: result.pages
        };
    });
}


export const ServicesQueryFetchKey = "services";

export const useServicesQuery = ({
    page, size, sortBy = "created_at", desc = false, filters = {}
}: UseEntityQueryProps) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, { page, size }, filters?.username ?? "", { sortBy, desc }, { filters }],
        queryFn: fetchServices,
        initialData: { entities: [], pageCount: 0 }
    })
}
