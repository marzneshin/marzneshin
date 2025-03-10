import { HostType } from "@marzneshin/modules/hosts";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";

export async function fetchHostsByIds({
    queryKey,
}: {
    queryKey: [string, number[]];
}): Promise<Array<HostType>> {
    return fetch(`/inbounds/hosts`, {
        query: {
            ids: queryKey[1],
        },
    }).then((res: HostType[]) => res);
}

export const HostsByIdsQueryFetchKey = "hosts";

export const useHostsByIdsQuery = ({ hostIds }: { hostIds: number[] }) => {
    return useQuery({
        queryKey: [HostsByIdsQueryFetchKey, hostIds],
        queryFn: fetchHostsByIds,
        initialData: [],
    });
};
