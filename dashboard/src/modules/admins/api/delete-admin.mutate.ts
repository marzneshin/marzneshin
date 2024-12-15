import { AdminType, AdminsQueryFetchKey } from "@marzneshin/modules/admins";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteAdmin(admin: AdminType): Promise<AdminType> {
    return fetch(`/admins/${admin.username}`, { method: 'delete' }).then((admin) => {
        return admin;
    });
}

const AdminsDeleteFetchKey = "admins";


const handleError = (error: Error, value: AdminType) => {
    toast.error(
        i18n.t('events.delete.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: AdminType) => {
    toast.success(
        i18n.t('events.delete.success.title', { name: value.username }),
        {
            description: i18n.t('events.delete.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [AdminsQueryFetchKey] })
}

export const useAdminsDeletionMutation = () => {
    return useMutation({
        mutationKey: [AdminsDeleteFetchKey],
        mutationFn: fetchDeleteAdmin,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
