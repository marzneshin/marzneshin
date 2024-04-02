import { FC, useCallback } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button
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
} from "./fields";
import { useMutationDialog } from "@marzneshin/hooks";

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
    }), []);
    const { form, handleSubmit } =
        useMutationDialog({
            entity,
            onOpenChange,
            createMutation: useUsersCreationMutation(),
            updateMutation: useUsersUpdateMutation(),
            schema: UserSchema,
            getDefaultValue: getDefaultValues
        })

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
                        <div className="flex-col grid-cols-2 sm:flex md:grid">
                            <div>
                                <UsernameField form={form} />
                                <div className="flex sm:flex-row md:flex-col gap-2 items-center w-full">
                                    <DataLimitField form={form} />
                                    {form.watch().data_limit !== 0 && <DataLimitResetStrategyField form={form} />}
                                </div>
                                <ExpireDateField form={form} />
                                <NoteField form={form} />
                            </div>
                            <div>
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
