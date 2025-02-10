import { HostType } from "@marzneshin/modules/hosts";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/common/utils";

export async function fetchHostsByIds({
    queryKey,
}: {
    queryKey: [string, number[]];
}): Promise<Array<HostType>> {
    return queryKey[1].map((id) => fetch(`/inbounds/hosts/${id}`));
}

export const HostsByIdsQueryFetchKey = "hosts";

export const useHostsByIdsQuery = ({ hostIds }: { hostIds: number[] }) => {
    return useQuery({
        queryKey: [HostsByIdsQueryFetchKey, hostIds],
        queryFn: fetchHostsByIds,
        initialData: [],
    });
};
