import { UserMutationType, UsersQueryFetchKey } from "@marzneshin/modules/users";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchDeleteUser(user: UserMutationType): Promise<UserMutationType> {
    return fetch(`/users/${user.username}`, { method: 'delete' }).then((user) => {
        return user;
    });
}

const UsersDeleteFetchKey = "users";


const handleError = (error: ApiError, value: UserMutationType) => {
    handleApiErrorWithContext(error, {
        action: 'delete',
        entityName: 'user',
        entityValue: value.username
    });
}

const handleSuccess = (value: UserMutationType) => {
    toast.success(
        i18n.t('events.delete.success.title', { name: value.username }),
        {
            description: i18n.t('events.delete.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersQueryFetchKey] })
}

export const useUsersDeletionMutation = () => {
    return useMutation({
        mutationKey: [UsersDeleteFetchKey],
        mutationFn: fetchDeleteUser,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
