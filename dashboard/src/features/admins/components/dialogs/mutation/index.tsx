import { type FC, useState, useEffect, useCallback } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    ScrollArea,
    VStack,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import {
    useAdminsCreationMutation,
    useAdminsUpdateMutation,
    AdminMutationSchema,
    type AdminMutationType,
    AdminType,
} from "@marzneshin/features/admins";
import {
    PasswordField,
    UsernameField,
    ServicesField,
    EnabledField,
    ModifyUsersAccessField,
    SubscriptionUrlPrefixField,
    SudoPrivilageField,
    AllServicesAccessField,
} from "./fields";
import { useMutationDialog } from "@marzneshin/hooks";

interface AdminsMutationDialogProps {
    open: boolean;
    onOpenChange: (state: boolean) => void;
    onClose: () => void;
    entity?: AdminType | null;
}

export const AdminsMutationDialog: FC<AdminsMutationDialogProps> = ({
    open,
    onOpenChange,
    onClose,
    entity = null,
}) => {
    const { t } = useTranslation();
    const getDefaultValues = useCallback(
        (): AdminMutationType => ({
            service_ids: [],
            username: "",
            password: null,
            is_sudo: false,
            enabled: true,
        }),
        [],
    );

    const { form, handleSubmit } = useMutationDialog({
        entity,
        onOpenChange,
        createMutation: useAdminsCreationMutation(),
        updateMutation: useAdminsUpdateMutation(),
        schema: AdminMutationSchema,
        getDefaultValue: getDefaultValues,
    });

    const [change, setChange] = useState<boolean>(entity === null);
    if (entity !== null)
        form.setValue("password", null,
            {
                shouldTouch: true,
                shouldDirty: true,
            });

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent className="min-w-full h-full md:h-auto md:min-w-[42rem]">
                <ScrollArea className="flex flex-col justify-between h-full ">
                    <DialogHeader className="mb-3">
                        <DialogTitle className="text-primary">
                            {t("page.admins.dialogs.creation.title")}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit} >
                            <div className="flex-col grid-cols-2 gap-2 sm:flex md:grid h-full">
                                <div className="space-y-3">
                                    <UsernameField />
                                    <PasswordField change={change} handleChange={setChange} />
                                    <EnabledField />
                                    <ModifyUsersAccessField />
                                    <SubscriptionUrlPrefixField />
                                    <SudoPrivilageField />
                                    <AllServicesAccessField />
                                </div>
                                <VStack>
                                    <ServicesField />
                                </VStack>
                            </div>
                            <Button
                                className="mt-3 w-full font-semibold"
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {t("submit")}
                            </Button>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};
