import { HostType } from "@marzneshin/modules/hosts";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { HostRequestDto } from "./host-mutation.dto";

export async function fetchCreateHost({ inboundId, host }: HostRequestDto): Promise<HostRequestDto> {
    return fetch(`/inbounds/${inboundId}/hosts`,
        { method: 'post', body: host }).then((host: HostType) => ({ inboundId, host }));
}

const handleError = (error: Error, value: HostRequestDto) => {
    toast.error(
        i18n.t('events.create.error', { name: value.host.remark }),
        {
            description: error.message
        })
}

const handleSuccess = (value: HostRequestDto) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.host.remark }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: ["inbounds"] })
}


const HostsCreateFetchKey = "hosts";

export const useHostsCreationMutation = () => {
    return useMutation({
        mutationKey: [HostsCreateFetchKey],
        onError: handleError,
        onSuccess: handleSuccess,
        mutationFn: fetchCreateHost,
    })
}
