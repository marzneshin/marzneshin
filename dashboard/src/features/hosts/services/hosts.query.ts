import { HostType } from "@marzneshin/features/hosts";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import { InboundType } from "@marzneshin/features/inbounds";

export async function fetchHosts({ queryKey }: { queryKey: [string, number | undefined] }): Promise<HostType[]> {
    if (queryKey[1]) {
        return fetch(`/inbounds/${queryKey[1]}/hosts`).then((result) => {
            return result.items;
        });
    } else {
        return fetch(`/inbounds/hosts`).then((result) => {
            return result.items;
        });
    }
}

export const HostsQueryFetchKey = "hosts";

export const useHostsQuery = (inbound?: InboundType | undefined) => {
    return useQuery({
        queryKey: [HostsQueryFetchKey, inbound?.id],
        queryFn: fetchHosts,
        initialData: []
    })
}
