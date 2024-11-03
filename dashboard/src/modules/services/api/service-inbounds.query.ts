import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";
import { InboundType } from "@marzneshin/modules/inbounds";
import {
    FetchEntityReturn,
    SelectableEntityQueryKeyType
} from "@marzneshin/libs/entity-table";

interface FetchServiceInboundsType {
    queryKey: [string, number, number, number]
}

interface UseServiceInboundsQueryProps {
    serviceId: number;
    page?: number;
    size?: number;
}

export async function fetchServiceInbounds({
    queryKey
}: FetchServiceInboundsType): Promise<InboundType[]> {
    return fetch(`/services/${queryKey[1]}/inbounds`, {
        query: {
            page: queryKey[2],
            size: queryKey[3]
        }
    }).then((result) => {
        return result.items;
    });
}


export async function fetchSelectableServiceInbounds({ queryKey }: SelectableEntityQueryKeyType): FetchEntityReturn<InboundType> {
    const pagination = queryKey[3];
    const primaryFilter = queryKey[4];
    const filters = queryKey[6].filters;
    return fetch(`/inbounds`, {
        query: {
            ...pagination,
            ...filters,
            tag: primaryFilter,
            descending: queryKey[5].desc,
            order_by: queryKey[5].sortBy,
        }
    }).then((result) => {
        return {
            entities: result.items,
            pageCount: result.pages
        };
    })
}

const ServicesQueryFetchKey = "services";

export const useInboundsServiceQuery = ({
    serviceId, page = 1, size = 50
}: UseServiceInboundsQueryProps) => {
    return useQuery({
        queryKey: [ServicesQueryFetchKey, serviceId, page, size],
        queryFn: fetchServiceInbounds,
        initialData: []
    })
}
