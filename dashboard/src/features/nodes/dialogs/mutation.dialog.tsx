import { FC, useEffect } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
    Input,
    FormField,
    Checkbox,
    Button
} from '@marzneshin/components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { NodeType, NodeSchema, useNodesCreationMutation, useNodesUpdateMutation } from "..";

interface MutationDialogProps {
    entity: NodeType | null;
    open: boolean;
    onOpenChange: (state: boolean) => void;
}

const getDefaultValues = (): NodeType => ({
    name: '',
    address: '',
    status: 'none',
    port: 62050,
    usage_coefficient: 1,
    add_as_new_host: true,
});

export const MutationDialog: FC<MutationDialogProps> = ({
    entity,
    open,
    onOpenChange,
}) => {
    const form = useForm({
        defaultValues: entity ? entity : getDefaultValues(),
        resolver: zodResolver(NodeSchema)
    });
    const updateMutation = useNodesUpdateMutation();
    const createMutation = useNodesCreationMutation();
    const { t } = useTranslation();

    const submit = (values: NodeType) => {
        if (entity) {
            updateMutation.mutate(values);
        } else {
            createMutation.mutate(values);
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
                            ? t('page.nodes.dialogs.edition.title')
                            : t('page.nodes.dialogs.creation.title')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('name')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('address')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="port"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('port')}</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="usage_coefficient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('page.nodes.usage_coefficient')}</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="add_as_new_host"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex flex-row gap-1 items-center">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormLabel>
                                                {t('page.nodes.add_as_new_host')}
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
