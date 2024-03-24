
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
} from '@marzneshin/components'
import { FC, useEffect } from 'react'
import { NodeSchema, NodeType, useNodesCreationMutation, useNodesUpdateMutation } from '..'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

interface MutationDialogProps {
    node: NodeType | null
    open: boolean
    onOpenChange: (state: boolean) => void
}

const getDefaultValues = (): NodeType => ({
    name: '',
    address: '',
    port: 62050,
    status: 'none',
    usage_coefficient: 1,
    add_as_new_host: true,
})

export const MutationDialog: FC<MutationDialogProps> = ({ node, open, onOpenChange }) => {
    const updateMutation = useNodesUpdateMutation();
    const createMutation = useNodesCreationMutation();
    const form = useForm({
        defaultValues: node ? node : getDefaultValues(),
        resolver: zodResolver(NodeSchema)
    })
    const { t } = useTranslation();

    const submit = (values: NodeType) => {
        if (node) {
            updateMutation.mutate(values)
        } else {
            createMutation.mutate(values)
        }
        onOpenChange(false);
    }

    useEffect(() => {
        if (node)
            form.reset(node);
        else
            form.reset(getDefaultValues())
    }, [node, form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {node ?
                            t('page.nodes.dialogs.edition.title') :
                            t('page.nodes.dialogs.creation.title')}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(submit)} >
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
                        <div className="flex flex-row gap-3 my-1">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-1/3">
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
                                    <FormItem className="w-1/3">
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
                                    <FormItem className="w-1/3">
                                        <FormLabel>{t('page.nodes.usage_coefficient')}</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="add_as_new_host"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormControl >
                                        <div className="flex flex-row gap-1 items-center">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            >
                                            </Checkbox>
                                            <FormLabel>
                                                {t('page.nodes.add_as_new_host')}
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="mt-3 w-full font-semibold" type="submit">
                            {t('submit')}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
