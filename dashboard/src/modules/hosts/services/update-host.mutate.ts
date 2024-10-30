import { HostType } from "@marzneshin/modules/hosts";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { HostUpdateRequestDto } from "./host-mutation.dto";

export async function fetchHostsUpdateMutation({ hostId, host }: HostUpdateRequestDto): Promise<HostUpdateRequestDto> {
    return fetch(`/inbounds/hosts/${hostId}`,
        { method: 'put', body: host }).then((host: HostType) => ({ hostId, host }));
}

const handleError = (error: Error, value: HostUpdateRequestDto) => {
    toast.error(
        i18n.t('events.update.error', { name: value.host.remark }),
        {
            description: error.message
        })
}

const handleSuccess = (value: HostUpdateRequestDto) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.host.remark }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: ["inbounds"] })
}


const HostsCreateFetchKey = "hosts";

export const useHostsUpdateMutation = () => {
    return useMutation({
        mutationKey: [HostsCreateFetchKey],
        onError: handleError,
        onSuccess: handleSuccess,
        mutationFn: fetchHostsUpdateMutation,
    })
}
