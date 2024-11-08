import { type FC, useMemo, useState } from "react";
import {
    Separator,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    ScrollArea,
    VStack,
    Switch,
} from "@marzneshin/common/components";
import {
    Separator,
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    ScrollArea,
    VStack,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";
import {
    DATA_LIMIT_METRIC,
    useUsersCreationMutation,
    useUsersUpdateMutation,
    UserSchema,
    UsernameField,
    type UserMutationType,
} from "@marzneshin/modules/users";
import { ServicesField } from "@marzneshin/modules/services";
import { NoteField } from "./fields";
import { type MutationDialogProps, useMutationDialog } from "@marzneshin/common/hooks";
import { DataLimitField, ExpirationMethodFields } from "./sections";
import {
    DATA_LIMIT_METRIC,
    useUsersCreationMutation,
    useUsersUpdateMutation,
    UserSchema,
    UsernameField,
    type UserMutationType,
} from "@marzneshin/modules/users";
import { ServicesField } from "@marzneshin/modules/services";
import { NoteField } from "./fields";
import { type MutationDialogProps, useMutationDialog } from "@marzneshin/common/hooks";
import { DataLimitFields, ExpirationMethodFields } from "./sections";
export const UsersMutationDialog: FC<MutationDialogProps<UserMutationType>> = ({
    entity,
    onClose,
}) => {
    const { t } = useTranslation();
    const [isDataLimitEnabled, setIsDataLimitEnabled] = useState(!entity || entity.data_limit !== undefined);

    const defaultValue = useMemo(
        () => ({
            service_ids: [],
            username: "",
            data_limit_reset_strategy: "no_reset",
            data_limit: undefined,
            note: "",
            expire_date: "",
            expire_strategy: "fixed_date",
        }),
        [],
    );

    const { open, onOpenChange, form, handleSubmit } = useMutationDialog({
        entity,
        onClose,
        createMutation: useUsersCreationMutation(),
        updateMutation: useUsersUpdateMutation(),
        schema: UserSchema,
        defaultValue,
        loadFormtter: (d) => ({
            ...d,
            data_limit: d.data_limit !== undefined ? d.data_limit / DATA_LIMIT_METRIC : undefined,
        }),
    });

    const handleDataLimitChange = (value: number | undefined) => {
        form.setValue("data_limit", value);
    };

    const handleDataLimitToggle = (checked: boolean) => {
        setIsDataLimitEnabled(checked);
        if (!checked) {
            form.setValue("data_limit", undefined);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent className="min-w-full h-full md:h-auto md:min-w-[42rem]">
                <ScrollArea className="flex flex-col justify-between h-full ">
                    <DialogHeader className="mb-3">
                        <DialogTitle className="text-primary">
                            {entity
                                ? t("page.users.dialogs.edition.title")
                                : t("page.users.dialogs.creation.title")}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit}>
                            <div className="flex-col grid-cols-2 gap-2 sm:flex md:grid h-full">
                                <div className="space-y-3">
                                    <UsernameField disabled={!!entity?.username} />
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <span>{t('page.users.enable_data_limit')}</span>
                                        <Switch
                                            checked={isDataLimitEnabled}
                                            onCheckedChange={handleDataLimitToggle}
                                        />
                                    </div>
                                    <DataLimitField
                                        disabled={!isDataLimitEnabled}
                                        onChange={handleDataLimitChange}
                                    />
                                    <Separator />
                                    <ExpirationMethodFields entity={entity} />
                                    <Separator />
                                    <NoteField />
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
export const UsersMutationDialog: FC<MutationDialogProps<UserMutationType>> = ({
    entity,
    onClose,
}) => {
    const { t } = useTranslation();
    const defaultValue = useMemo(
        () => ({
            service_ids: [],
            username: "",
            data_limit_reset_strategy: "no_reset",
            data_limit: undefined,
            note: "",
            expire_date: "",
            expire_strategy: "fixed_date",
        }),
        [],
    );

    const { open, onOpenChange, form, handleSubmit } = useMutationDialog({
        entity,
        onClose,
        createMutation: useUsersCreationMutation(),
        updateMutation: useUsersUpdateMutation(),
        schema: UserSchema,
        defaultValue,
        loadFormtter: (d) => ({
            ...d,
            data_limit: (d.data_limit ? d.data_limit : 0) / DATA_LIMIT_METRIC,
        }),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent className="min-w-full h-full md:h-auto md:min-w-[42rem]">
                <ScrollArea className="flex flex-col justify-between h-full ">
                    <DialogHeader className="mb-3">
                        <DialogTitle className="text-primary">
                            {entity
                                ? t("page.users.dialogs.edition.title")
                                : t("page.users.dialogs.creation.title")}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={handleSubmit}>
                            <div className="flex-col grid-cols-2 gap-2 sm:flex md:grid h-full">
                                <div className="space-y-3">
                                    <UsernameField disabled={!!entity?.username} />
                                    <Separator />
                                    <DataLimitFields />
                                    <Separator />
                                    <ExpirationMethodFields entity={entity} />
                                    <Separator />
                                    <NoteField />
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
};
