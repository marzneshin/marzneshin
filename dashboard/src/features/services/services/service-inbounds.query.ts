import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { InboundType } from "@marzneshin/features/inbounds";

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
