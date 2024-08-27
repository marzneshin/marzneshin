import { fetch } from "@marzneshin/utils";
import { ServiceType } from "../types";
import {
    EntityQueryKeyType,
    FetchEntityReturn,
    UseEntityQueryProps
} from "@marzneshin/features/entity-table";
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
            entity: services,
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
        initialData: { entity: [], pageCount: 0 }
    })
}
