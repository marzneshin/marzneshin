import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    AdminsQueryFetchKey,
    AdminMutationType,
    AdminType
} from "@marzneshin/modules/admins";

export async function updateAdmin(admin: AdminMutationType): Promise<AdminType> {
    return fetch(`/admins/${admin.username}`, { method: 'put', body: admin }).then((admin) => {
        return admin;
    });
}

const handleError = (error: ApiError, value: AdminMutationType) => {
    handleApiErrorWithContext(error, {
        action: 'update',
        entityName: 'admin',
        entityValue: value.username
    });
}

const handleSuccess = (value: AdminType) => {
    toast.success(
        i18n.t('events.update.success.title', { name: value.username }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [AdminsQueryFetchKey] })
}


const AdminsUpdateFetchKey = "admins";

export const useAdminsUpdateMutation = () => {
    return useMutation({
        mutationKey: [AdminsUpdateFetchKey],
        mutationFn: updateAdmin,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
