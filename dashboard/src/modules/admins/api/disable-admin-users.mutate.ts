import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import { AdminType } from "../types";

interface AdminUsersStatusDisableQuery {
    admin: AdminType;
}

export async function adminUsersStatusDisable({ admin }: AdminUsersStatusDisableQuery): Promise<AdminType> {
    return fetch(`/admins/${admin.username}/disable_users`, { method: 'post' }).then((admin) => {
        return admin;
    });
}

const handleError = (error: ApiError, value: AdminUsersStatusDisableQuery) => {
    handleApiErrorWithContext(error, {
        action: 'user_status',
        entityName: 'admin',
        entityValue: value.admin.username
    });
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

export const useAdminUsersStatusDisable = () => {
    return useMutation({
        mutationKey: [UsersStatusEnabledFetchKey],
        mutationFn: adminUsersStatusDisable,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
