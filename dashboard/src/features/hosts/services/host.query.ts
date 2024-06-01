import { HostType } from "@marzneshin/features/hosts";
import { useQuery } from "@tanstack/react-query";
import { fetch } from "@marzneshin/utils";

export async function fetchHost({ queryKey }: { queryKey: [string, number] }): Promise<HostType> {
    return fetch(`/inbounds/hosts/${queryKey[1]}`).then((result) => result);
}

export const HostQueryFetchKey = "hosts";

export const useHostQuery = ({ hostId }: { hostId: number }) => {
    return useQuery({
        queryKey: [HostQueryFetchKey, hostId],
        queryFn: fetchHost,
        initialData: undefined
    })
}
