import { FC, useCallback, useEffect, useState } from "react";
import {
    Tabs,
    TabsTrigger,
    TabsContent,
    FormLabel
} from '@marzneshin/components';
import {
    UserMutationType,
} from "@marzneshin/features/users";
import {
    ExpireDateField,
    OnHoldTimeoutField,
    OnHoldExpireDurationField,
} from "../fields";
import { TabsList } from "@radix-ui/react-tabs";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ExpirationMethodProps {
    entity: UserMutationType | null
}

export const ExpirationMethodFields: FC<ExpirationMethodProps> = ({ entity }) => {
    const form = useFormContext()
    const { t } = useTranslation()
    const getUserExpirationMethod = useCallback((entity: UserMutationType) => {
        if (entity.status === "on_hold")
            return 'onhold'
        else if (entity.expire !== undefined)
            return 'determined'
        else
            return 'unlimited'
    }, [])

    const defaultExpirationMethodTab = entity?.username ? getUserExpirationMethod(entity) : 'determined'
    const [
        selectedExpirationMethodTab,
        setSelectedExpirationMethodTab
    ] = useState<'determined' | 'onhold' | 'unlimited' | string>(defaultExpirationMethodTab);

    useEffect(() => {
        form.setValue("status", "active")
        if (selectedExpirationMethodTab === 'onhold') {
            form.setValue("status", "on_hold")
            form.setValue("expire", undefined);
            form.clearErrors("expire");
        } else if (selectedExpirationMethodTab === "unlimited") {
            form.setValue("expire", undefined);
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
    }, [selectedExpirationMethodTab, form]);

    return (
        <>
            <FormLabel>
                {t('page.users.expire_method')}
            </FormLabel>
            <Tabs defaultValue={defaultExpirationMethodTab} onValueChange={setSelectedExpirationMethodTab} className="mt-2 w-full">
                <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
                    <TabsTrigger
                        className="w-full"
                        value="determined">
                        {t('page.users.determined_expire')}
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="onhold">
                        {t('page.users.onhold_expire')}
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="unlimited">
                        {t('page.users.unlimited')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="determined">
                    <ExpireDateField />
                </TabsContent>
                <TabsContent value="onhold">
                    <OnHoldExpireDurationField />
                    <OnHoldTimeoutField />
                </TabsContent>
            </Tabs>
        </>
    )
}
