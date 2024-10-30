import { NodeType } from "@marzneshin/modules/nodes";
import { useMutation } from "@tanstack/react-query";
import { fetch, queryClient } from "@marzneshin/common/utils";
import { toast } from "sonner";
import i18n from "@marzneshin/features/i18n";
import {
    subscriptionSettingsQueryKey,
    SubscriptionSettingsType
} from "@marzneshin/modules/settings/subscription";

export async function updateSubscriptionSettings(settings: SubscriptionSettingsType): Promise<NodeType> {
    return fetch("/system/settings/subscription", { method: 'put', body: settings }).then((node) => {
        return node;
    });
}

const handleError = () => {
    toast.error(
        i18n.t('events.update.error'),
    )
}

const handleSuccess = () => {
    toast.success(
        i18n.t('events.update.success.title', { name: "Subscription Settings" }),
        {
            description: i18n.t('events.update.success.desc')
        })
    queryClient.invalidateQueries({ queryKey: subscriptionSettingsQueryKey })
}

export const useSubscriptionSettingsMutation = () => {
    return useMutation({
        mutationKey: subscriptionSettingsQueryKey,
        mutationFn: updateSubscriptionSettings,
        onError: handleError,
        onSuccess: handleSuccess,
    })
}
