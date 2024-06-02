import { UserMutationType } from "@marzneshin/features/users";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type ExpirationMethodStrategy = "onhold" | "determined" | "unlimited";

const getUserExpirationMethod = (entity: UserMutationType): ExpirationMethodStrategy => {
    if (entity.status === "on_hold")
        return 'onhold'
    else if (entity.expire !== undefined && entity.expire !== null)
        return 'determined'
    else
        return 'unlimited'
}


export const useExpirationMethodTabs = ({ entity }: { entity: UserMutationType | null }) => {
    const form = useFormContext()

    const defaultExpirationMethodTab =
        (entity !== null) ? getUserExpirationMethod(entity) : 'determined'
    const [
        selectedExpirationMethodTab,
        setSelectedExpirationMethodTab
    ] = useState<ExpirationMethodStrategy | string>(defaultExpirationMethodTab);

    useEffect(() => {
        form.setValue("status", "active")
        if (selectedExpirationMethodTab === 'onhold') {
            form.setValue("status", "on_hold")
            form.setValue("expire", undefined);
            form.clearErrors("expire");
        } else if (selectedExpirationMethodTab === "unlimited") {
            form.setValue("expire", 0);
            form.setValue("on_hold_expire_duration", undefined);
            form.setValue("on_hold_timeout", undefined);
            form.clearErrors("expire");
            form.clearErrors("on_hold_expire_duration");
            form.clearErrors("on_hold_timeout");
        } else {
            form.setValue("on_hold_expire_duration", 0);
            form.setValue("on_hold_timeout", null);
            form.clearErrors("on_hold_expire_duration");
            form.clearErrors("on_hold_timeout");
        }
        // eslint-disable-next-line
    }, [selectedExpirationMethodTab]);

    return { selectedExpirationMethodTab, defaultExpirationMethodTab, setSelectedExpirationMethodTab }
}
