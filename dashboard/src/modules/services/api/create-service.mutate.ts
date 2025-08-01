import { ServiceMutationType, ServicesQueryFetchKey } from "@marzneshin/modules/services";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateService(service: ServiceMutationType): Promise<ServiceMutationType> {
    return fetch('/services', { method: 'post', body: service }).then((service) => {
        return service;
    });
}

const handleError = (error: ApiError, value: ServiceMutationType) => {
    handleApiErrorWithContext(error, {
        action: 'create',
        entityName: 'service',
        entityValue: value.name
    });
}

const handleSuccess = (value: ServiceMutationType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.name }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [ServicesQueryFetchKey] })
}


const ServicesCreateFetchKey = "services";

export const useServicesCreationMutation = () => {
    return useMutation({
        mutationKey: [ServicesCreateFetchKey],
        mutationFn: fetchCreateService,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
