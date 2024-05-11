import { FC, useEffect } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
} from '@marzneshin/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
    HostSchema,
    HostType,
    getDefaultValues,
    useHostsCreationMutation,
    useHostsUpdateMutation
} from "@marzneshin/features/hosts";
import { RemarkField } from "./fields/remark";
import {
    AddressField,
    PortField,
    HostField,
    PathField,
    SecurityFields,
} from "./fields";

interface MutationDialogProps {
    entity: HostType | null
    open: boolean
    inboundId: number
    onOpenChange: (state: boolean) => void
}


export const HostsMutationDialog: FC<MutationDialogProps> = ({
    inboundId,
    entity,
    open,
    onOpenChange,
}) => {
    const form = useForm({
        defaultValues: entity ? entity : getDefaultValues(),
        resolver: zodResolver(HostSchema)
    });
    const updateMutation = useHostsUpdateMutation();
    const createMutation = useHostsCreationMutation();
    const { t } = useTranslation();

    const submit = (values: HostType) => {
        if (entity && entity.id !== undefined) {
            console.log(entity)
            updateMutation.mutate({ hostId: entity.id, host: values });
        } else {
            createMutation.mutate({ inboundId, host: values });
        }
        onOpenChange(false);
    };

    useEffect(() => {
        if (entity) form.reset(entity);
        else form.reset(getDefaultValues());
    }, [entity, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {entity
                            ? t('page.hosts.dialogs.edition.title')
                            : t('page.hosts.dialogs.creation.title')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <RemarkField />
                        <div className="flex flex-row gap-1 items-center">
                            <AddressField />
                            <PortField />
                        </div>
                        <PathField />
                        <HostField />
                        <SecurityFields />
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
