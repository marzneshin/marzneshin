import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { ServicesQueryFetchKey } from "./services.query";
import { ServiceMutationType } from "../types";


export async function updateService(service: ServiceMutationType): Promise<ServiceMutationType> {
    return fetch(`/services/${service.id}`, { method: 'put', body: service }).then((service) => {
        return service;
    });
}

const handleError = (error: ApiError, value: ServiceMutationType) => {
    handleApiErrorWithContext(error, {
        action: 'update',
        entityName: 'service',
        entityValue: value.name
    });
}

const handleSuccess = (value: ServiceMutationType) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.name }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [ServicesQueryFetchKey] })
}


const ServicesUpdateFetchKey = "services-create-fetch-key";

export const useServicesUpdateMutation = () => {
    return useMutation({
        mutationKey: [ServicesUpdateFetchKey],
        mutationFn: updateService,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
