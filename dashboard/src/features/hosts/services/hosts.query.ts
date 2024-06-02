import { HostType } from "@marzneshin/features/hosts";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

export async function fetchHosts({ queryKey }: { queryKey: [string, number | undefined, string] }): Promise<HostType[]> {
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

export const useHostsQuery = (inboundId?: number | undefined) => {
    return useQuery({
        queryKey: ["inbounds",inboundId,HostsQueryFetchKey ],
        queryFn: fetchHosts,
        initialData: []
    })
}
