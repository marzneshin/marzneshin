import { HostType } from "@marzneshin/features/hosts";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";
import {
    FetchEntityReturn,
    UseEntityQueryProps,
    EntitySidebarQueryKeyType
} from "@marzneshin/features/entity-table/hooks";

export async function fetchHosts({ queryKey }: EntitySidebarQueryKeyType): FetchEntityReturn<HostType> {
    return fetch(queryKey[1] !== undefined ? `/inbounds/${queryKey[1]}/hosts` : `/inbounds/hosts`, {
        query: {
            page: queryKey[3],
            size: queryKey[4],
        }
    }).then((result) => {
        return {
            entity: result.items,
            pageCount: result.pages
        };
    });
}

export const HostsQueryFetchKey = "hosts";

export const useHostsQuery = ({
    inboundId, page, size, search = ""
}: UseEntityQueryProps & { inboundId?: number }) => {
    return useQuery({
        queryKey: ["inbounds", inboundId, HostsQueryFetchKey, page, size, search],
        queryFn: fetchHosts,
        initialData: { entity: [], pageCount: 0 }
    })
}
