import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    UsersQueryFetchKey,
    UserMutationType
} from "@marzneshin/modules/users";

export async function userUsageReset(user: UserMutationType): Promise<UserMutationType> {
    return fetch(`/users/${user.username}/reset`, { method: 'post', body: user }).then((user) => {
        return user;
    });
}

const handleError = (error: ApiError, value: UserMutationType) => {
    handleApiErrorWithContext(error, {
        action: 'user_reset',
        entityName: 'user',
        entityValue: value.username
    });
}

const handleSuccess = (value: UserMutationType) => {
    toast.success(
        i18n.t('events.user_reset.success.title', { name: value.username }),
        {
            description: i18n.t('events.user_reset.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersQueryFetchKey] })
}


const UsersUpdateFetchKey = "users";

export const useUserUsageResetCmd = () => {
    return useMutation({
        mutationKey: [UsersUpdateFetchKey, "reset"],
        mutationFn: userUsageReset,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
