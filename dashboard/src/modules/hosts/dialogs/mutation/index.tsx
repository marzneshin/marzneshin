import { type FC, useEffect } from "react";
import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
    ScrollArea,
} from "@marzneshin/common/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
    useHostsCreationMutation,
    useHostsUpdateMutation,
    type HostWithProfileType,
    type HostWithProfileSchemaType
} from "@marzneshin/modules/hosts";
import { useDialog, type MutationDialogProps } from "@marzneshin/common/hooks";
import { ProtocolType } from "@marzneshin/modules/inbounds";
import { useProfileStrategy } from "./profiles";

interface HostMutationDialogProps extends MutationDialogProps<HostWithProfileType> {
    inboundId?: number;
    protocol?: ProtocolType;
}

const transformFormValue = (values: any) => {
    if (!(values.alpn && values.fingerprint))
        return values;
    const port = values.port === "" ? null : values.port;
    const alpn = values.alpn === "none" ? "" : values.alpn;
    const fingerprint = values.fingerprint === "none" ? "" : values.fingerprint;
    return { ...values, alpn, fingerprint, port };
};

export const HostsMutationDialog: FC<HostMutationDialogProps> = ({
    entity,
    inboundId,
    onClose,
    protocol,
}) => {
    const [open, onOpenChange] = useDialog(true);
    const [Schema, ProfileFields, defaultValue] = useProfileStrategy(protocol)
    const form = useForm<HostWithProfileSchemaType>({
        defaultValues: entity ? entity : defaultValue,
        resolver: zodResolver(Schema),
    });
    const updateMutation = useHostsUpdateMutation();
    const createMutation = useHostsCreationMutation();
    const { t } = useTranslation();

    const submit = (values: HostWithProfileSchemaType) => {
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
        else form.reset(defaultValue);
    }, [entity, form, open, defaultValue]);

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
                            <ProfileFields />
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
