import { AdminType, AdminMutationType, AdminsQueryFetchKey } from "@marzneshin/modules/admins";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateAdmin(admin: AdminMutationType): Promise<AdminType> {
    return fetch('/admins', { method: 'post', body: admin }).then((admin) => {
        return admin;
    });
}

const handleError = (error: Error, value: AdminMutationType) => {
    toast.error(
        i18n.t('events.create.error', { name: value.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: AdminType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.username }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [AdminsQueryFetchKey] })
}


const AdminsCreateFetchKey = "admins";

export const useAdminsCreationMutation = () => {
    return useMutation({
        mutationKey: [AdminsCreateFetchKey],
        mutationFn: fetchCreateAdmin,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
