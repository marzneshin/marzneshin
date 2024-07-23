import { type FC, useEffect } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    ScrollArea,
    HStack,
} from "@marzneshin/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
    HostSchema,
    getDefaultValues,
    useHostsCreationMutation,
    useHostsUpdateMutation,
    type HostType,
} from "@marzneshin/features/hosts";
import {
    RemarkField,
    AddressField,
    PortField,
    HostField,
    MuxField,
    FragmentField,
    PathField,
    SecurityFields,
} from "./fields";
import { useDialog, MutationDialogProps } from "@marzneshin/hooks";

interface HostMutationDialogProps extends MutationDialogProps<HostType> {
    inboundId?: number;
}

const transformFormValue = (values: HostType) => {
    const port = values.port === "" ? null : values.port;
    const alpn = values.alpn === "none" ? "" : values.alpn;
    const fingerprint = values.fingerprint === "none" ? "" : values.fingerprint;
    return { ...values, alpn, fingerprint, port };
};

export const HostsMutationDialog: FC<HostMutationDialogProps> = ({
    inboundId,
    entity,
    onClose,
}) => {
    const [open, onOpenChange] = useDialog(true);
    const form = useForm({
        defaultValues: entity ? entity : getDefaultValues(),
        resolver: zodResolver(HostSchema),
    });
    const updateMutation = useHostsUpdateMutation();
    const createMutation = useHostsCreationMutation();
    const { t } = useTranslation();

    const submit = (values: HostType) => {
        const host = transformFormValue(values);
        if (entity && entity.id !== undefined) {
            updateMutation.mutate({ hostId: entity.id, host });
            onOpenChange(false);
        } else if (inboundId !== undefined) {
            createMutation.mutate({ inboundId, host });
            onOpenChange(false);
        }
    };

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    useEffect(() => {
        if (entity) form.reset(entity);
        else form.reset(getDefaultValues());
    }, [entity, form, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent className="min-w-full h-full md:h-auto md:min-w-[32rem]">
                <ScrollArea className="flex flex-col h-full p-0">
                    <DialogHeader className="mb-3">
                        <DialogTitle className="text-primary">
                            {entity
                                ? t("page.hosts.dialogs.edition.title")
                                : t("page.hosts.dialogs.creation.title")}
                        </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submit)}
                            className="h-full flex flex-col justify-between"
                        >
                            <RemarkField />
                            <HStack className="gap-2 items-start">
                                <AddressField />
                                <PortField />
                            </HStack>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>{t("advanced-options")}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-row gap-2 items-start">
                                            <HostField />
                                            <PathField />
                                        </div>
                                        <FragmentField />
                                        <MuxField />
                                        <SecurityFields />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
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
