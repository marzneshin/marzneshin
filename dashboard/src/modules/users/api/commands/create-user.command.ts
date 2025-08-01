import { UserMutationType, UsersQueryFetchKey } from "@marzneshin/modules/users";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient, handleApiErrorWithContext, type ApiError } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";

export async function fetchCreateUser(user: UserMutationType): Promise<UserMutationType> {
    return fetch('/users', { method: 'post', body: user }).then((user) =>  user);
}

const handleError = (error: ApiError, value: any) => {
    const payload = error?.data;
    console.log("Server error payload:", payload);
    handleApiErrorWithContext(error, {
        action: 'create',
        entityName: 'user',
        entityValue: value.username
    });
}

const handleSuccess = (value: UserMutationType) => {
    toast.success(
        i18n.t('events.create.success.title', { name: value.username }),
        {
            description: i18n.t('events.create.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: [UsersQueryFetchKey] })
}


const UsersCreateFetchKey = "users";

export const useUsersCreationMutation = () => {
    return useMutation({
        mutationKey: [UsersCreateFetchKey],
        mutationFn: fetchCreateUser,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
