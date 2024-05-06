import { FC, useCallback, useEffect, useState } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    Tabs,
    TabsTrigger,
    TabsContent,
    FormLabel
} from '@marzneshin/components';
import { useTranslation } from 'react-i18next';
import {
    UserMutationType,
    useUsersCreationMutation,
    useUsersUpdateMutation
} from "@marzneshin/features/users";
import { UserSchema } from "./schema";
import {
    UsernameField,
    DataLimitField,
    ExpireDateField,
    DataLimitResetStrategyField,
    NoteField,
    ServicesField,
} from "./fields";
import { useMutationDialog } from "@marzneshin/hooks";
import { TabsList } from "@radix-ui/react-tabs";
import { OnHoldExpireDurationField } from "./fields/onhold-expire-duration";
import { OnHoldTimeoutField } from "./fields/onhold-timeout";

interface UsersMutationDialogProps {
    entity: UserMutationType | null;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

export const UsersMutationDialog: FC<UsersMutationDialogProps> = ({
    entity,
    open,
    onOpenChange,
}) => {
    const { t } = useTranslation();
    const getDefaultValues = useCallback((): UserMutationType => ({
        services: [],
        data_limit: 1,
        expire: null,
        username: '',
        data_limit_reset_strategy: 'no_reset',
        status: 'active',
        note: '',
        on_hold_expire_duration: 0,
        on_hold_timeout: undefined,
    }), []);


    const { form, handleSubmit } = useMutationDialog({
        entity,
        onOpenChange,
        createMutation: useUsersCreationMutation(),
        updateMutation: useUsersUpdateMutation(),
        schema: UserSchema,
        getDefaultValue: getDefaultValues,
    })

    const [
        selectedDataLimitTab,
        setSelectedDataLimitTab
    ] = useState<'limited' | 'unlimited' | string>('limited');
    useEffect(() => {
        if (selectedDataLimitTab === 'limited') {
            form.setValue("data_limit", 1)
            form.setValue("data_limit_reset_strategy", "no_reset");
        } else {
            form.setValue("data_limit", 0)
            form.setValue("data_limit_reset_strategy", "no_reset");
        }
    }, [selectedDataLimitTab, form]);


    const [
        selectedExpirationMethodTab,
        setSelectedExpirationMethodTab
    ] = useState<'determined' | 'onhold' | 'unlimited' | string>('determined');
    useEffect(() => {
        form.setValue("status", "active")
        if (selectedExpirationMethodTab === 'onhold') {
            form.setValue("status", "on_hold")
            form.setValue("expire", null);
            form.clearErrors("expire");
        } else if (selectedExpirationMethodTab === "unlimited") {
            form.setValue("expire", 0);
            form.setValue("on_hold_expire_duration", 0);
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
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent className="sm:max-w-full md:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {entity
                            ? t('page.users.dialogs.edition.title')
                            : t('page.users.dialogs.creation.title')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <div className="flex-col grid-cols-2 gap-2 sm:flex md:grid">
                            <div>
                                <UsernameField />
                                <FormLabel>
                                    {t('page.users.data_limit_method')}
                                </FormLabel>
                                <div className="flex gap-2 items-center w-full sm:flex-row md:flex-col">
                                    <Tabs defaultValue="limited" onValueChange={setSelectedDataLimitTab} className="mt-2 w-full">
                                        <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
                                            <TabsTrigger
                                                className="w-full"
                                                value="limited">
                                                {t('page.users.limited')}
                                            </TabsTrigger>
                                            <TabsTrigger
                                                className="w-full"
                                                value="unlimited">
                                                {t('page.users.unlimited')}
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="limited">
                                            <DataLimitField />
                                            {form.watch().data_limit !== 0 && <DataLimitResetStrategyField />}
                                        </TabsContent>
                                    </Tabs>
                                </div>
                                <FormLabel>
                                    {t('page.users.expire_method')}
                                </FormLabel>
                                <Tabs defaultValue="determined" onValueChange={setSelectedExpirationMethodTab} className="mt-2 w-full">
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
                                <NoteField />
                            </div>
                            <div>
                                <ServicesField />
                            </div>
                        </div>
                        <Button
                            className="mt-3 w-full font-semibold"
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {t('submit')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
