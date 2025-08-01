import { ServiceType, ServicesQueryFetchKey } from "@marzneshin/modules/services";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteService(service: ServiceType): Promise<ServiceType> {
    return fetch(`/services/${service.id}`, { method: 'delete' }).then((service) => {
        return service;
    });
}

const ServicesDeleteFetchKey = "services-delete-fetch-key";


const handleError = (error: ApiError, value: ServiceType) => {
    handleApiErrorWithContext(error, {
        action: 'delete',
        entityName: 'service',
        entityValue: value.name
    });
}

const handleSuccess = (value: ServiceType) => {
    toast.success(
        i18n.t('events.delete.success.title', { name: value.name }),
        {
            description: i18n.t('events.delete.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [ServicesQueryFetchKey] })
}

export const useServicesDeletionMutation = () => {
    return useMutation({
        mutationKey: [ServicesDeleteFetchKey],
        mutationFn: fetchDeleteService,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
