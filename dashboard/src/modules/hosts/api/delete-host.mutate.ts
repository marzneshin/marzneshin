import { HostType } from "@marzneshin/modules/hosts";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteHost(host: HostType): Promise<HostType> {
    return fetch(`/inbounds/hosts/${host.id}`, { method: 'delete' }).then((host) => {
        return host;
    });
}

const HostsDeleteFetchKey = "hosts";


const handleError = (error: ApiError, value: HostType) => {
    handleApiErrorWithContext(error, {
        action: 'delete',
        entityName: 'host',
        entityValue: value.remark
    });
}

const handleSuccess = (value: HostType) => {
    toast.success(
        i18n.t('events.delete.success.title', { name: value.remark }),
        {
            description: i18n.t('events.delete.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: ["inbounds"] })
}

export const useHostsDeletionMutation = () => {
    return useMutation({
        mutationKey: [HostsDeleteFetchKey],
        mutationFn: fetchDeleteHost,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
