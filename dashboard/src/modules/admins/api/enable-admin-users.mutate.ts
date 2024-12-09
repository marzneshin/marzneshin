import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { AdminType } from "../types";

interface AdminUsersStatusEnableQuery {
    admin: AdminType;
}

export async function adminUsersStatusEnable({ admin }: AdminUsersStatusEnableQuery): Promise<AdminType> {
    return fetch(`/admins/${admin.username}/enable_users`, { method: 'post' }).then((admin) => {
        return admin;
    });
}

const handleError = (error: Error, value: AdminUsersStatusEnableQuery) => {
    toast.error(
        i18n.t('events.user_status.error', { name: value.admin.username }),
        {
            description: error.message
        })
}

const handleSuccess = (value: AdminType) => {
    toast.success(
        i18n.t('events.user_status.success.title', { name: value.username }),
        {
            description: i18n.t('events.user_status.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersStatusEnabledFetchKey] })
    queryClient.invalidateQueries({ queryKey: [UsersStatusEnabledFetchKey, value.username] })
}


const UsersStatusEnabledFetchKey = "admins";

export const useAdminUsersStatusEnable = () => {
    return useMutation({
        mutationKey: [UsersStatusEnabledFetchKey],
        mutationFn: adminUsersStatusEnable,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
