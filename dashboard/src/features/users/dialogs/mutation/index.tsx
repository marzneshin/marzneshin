import { FC, useCallback, useEffect, useState } from "react";
import { DevTool } from '@hookform/devtools';
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    Tabs,
    TabsTrigger,
    TabsContent
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
        data_limit: 0,
        expire: null,
        username: '',
        data_limit_reset_strategy: 'no_reset',
        status: 'active',
        note: '',
        on_hold_expire_duration: 0,
        on_hold_timeout: null,
    }), []);

    const [services, setServices] = useState<number[]>(entity ? entity.services : [])

    const { form, handleSubmit } = useMutationDialog({
        entity,
        onOpenChange,
        createMutation: useUsersCreationMutation(),
        updateMutation: useUsersUpdateMutation(),
        schema: UserSchema,
        getDefaultValue: getDefaultValues,
    })

    useEffect(() => {
        form.setValue("services", services.map(Number).filter(item => typeof item === 'number'))
    }, [services, form])


    const [selectedTab, setSelectedTab] = useState<'determined' | 'onhold' | string>('determined');

    useEffect(() => {
        if (selectedTab === 'onhold') {
            form.setValue("status", "on_hold")
            form.setValue("expire", null);
            form.clearErrors("expire");
        } else {
            form.setValue("status", "active")
            form.setValue("on_hold_expire_duration", 0);
            form.setValue("on_hold_timeout", null);
            form.clearErrors("on_hold_expire_duration");
            form.clearErrors("on_hold_timeout");
        }
    }, [selectedTab, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
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
                                <div className="flex gap-2 items-center w-full sm:flex-row md:flex-col">
                                    <DataLimitField />
                                    {form.watch().data_limit !== 0 && <DataLimitResetStrategyField />}
                                </div>
                                <Tabs defaultValue="determined" onValueChange={setSelectedTab} className="mt-2 w-full">
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
                                <ServicesField services={services} setServices={setServices} />
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
                    <div className="block h-1/2">
                        <DevTool control={form.control} placement="top-left" />
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
