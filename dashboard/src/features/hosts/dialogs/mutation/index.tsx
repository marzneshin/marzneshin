
import { FC, useEffect, useState } from "react";
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
    Button,
    SelectItem,
    SelectContent,
    SelectValue,
    Select,
    SelectTrigger,
    Alert,
    AlertTitle,
    AlertDescription
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
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

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
    const security = form.getValues().security
    const [extraSecurity, setExtraSecurity] = useState<boolean>(["tls", "inbound_default"].includes(security))

    useEffect(() => {
        setExtraSecurity(["tls", "inbound_default"].includes(security))
    }, [security, setExtraSecurity])

    const submit = (values: HostType) => {
        if (entity) {
            updateMutation.mutate({ inboundId, host: values });
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
                        <FormField
                            control={form.control}
                            name="remark"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>{t('name')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row gap-1 items-center">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-2/3">
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
                        </div>
                        <FormField
                            control={form.control}
                            name="path"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>{t('path')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="host"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>{t('host')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="security"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('security')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a verified email to display" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="tls">TLS</SelectItem>
                                            <SelectItem value="inbound_default">Inbound Default</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {extraSecurity &&
                            <>
                                <FormField
                                    control={form.control}
                                    name="sni"
                                    render={({ field }) => (
                                        <FormItem >
                                            <FormLabel>{t('SNI')}</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="alpn"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('alpn')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select ALPN" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="h2">h2</SelectItem>
                                                    <SelectItem value="http/1.1">HTTP 1.1</SelectItem>
                                                    <SelectItem value="h2,http/1.1"> H2 HTTP 1.1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="fingerprint"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('fingerprint')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select fingerprint" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="none">None</SelectItem>
                                                    <SelectItem value="chrome">Chrome</SelectItem>
                                                    <SelectItem value="firefox">Firefox</SelectItem>
                                                    <SelectItem value="safari">Safari</SelectItem>
                                                    <SelectItem value="ios">iOS</SelectItem>
                                                    <SelectItem value="android">Android</SelectItem>
                                                    <SelectItem value="edge">Edge</SelectItem>
                                                    <SelectItem value="360">360</SelectItem>
                                                    <SelectItem value="qq">qq</SelectItem>
                                                    <SelectItem value="random">Random</SelectItem>
                                                    <SelectItem value="randomized">Randomized</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="allowinsecure"
                                    render={({ field }) => (
                                        <FormItem className="my-2">
                                            <FormControl>
                                                <div className="flex flex-row gap-1 items-center">
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                    <FormLabel>
                                                        {t('page.hosts.allowinsecure')}
                                                    </FormLabel>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                            {form.getValues().allowinsecure &&
                                                <Alert variant="destructive">
                                                    <ExclamationTriangleIcon className="w-4 h-4" />
                                                    <AlertTitle>
                                                        Warning
                                                    </AlertTitle>
                                                    <AlertDescription>
                                                        {t('page.hosts.dialogs.mutation.allowinsecure.alert')}
                                                    </AlertDescription>
                                                </Alert>}
                                        </FormItem>
                                    )}
                                />
                            </>
                        }
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
