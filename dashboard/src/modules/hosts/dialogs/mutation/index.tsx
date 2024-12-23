import { type FC, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Form,
    ScrollArea,
} from "@marzneshin/common/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
    type HostWithProfileSchemaType,
    type HostWithProfileType,
    useHostsCreationMutation,
    useHostsUpdateMutation,
} from "@marzneshin/modules/hosts";
import { type MutationDialogProps, useDialog } from "@marzneshin/common/hooks";
import { ProtocolType } from "@marzneshin/modules/inbounds";
import { useProfileStrategy } from "./profiles";
import {
    transformToDictionary,
    transformToFields,
} from "@marzneshin/libs/dynamic-field";

interface HostMutationDialogProps
    extends MutationDialogProps<HostWithProfileType> {
    inboundId?: number;
    protocol?: ProtocolType;
}

const transformFormValue = (values: any) => {
    if (!(values.alpn && values.fingerprint)) return values;
    const port = values.port === "" ? null : values.port;
    const alpn = values.alpn === "none" ? "" : values.alpn;
    const fingerprint = values.fingerprint === "none" ? "" : values.fingerprint;
    const http_headers = values.http_headers;
    return { ...values, alpn, fingerprint, port, http_headers };
};

const transformFormValueHttpHeaders = (values: any) => {
    const http_headers = values.http_headers
        ? transformToDictionary(values.http_headers)
        : undefined;
    return { ...values, http_headers };
};

const formMutationToAPIAdapter = (values: HostWithProfileType) => {
    if (values.http_headers)
        return {
            ...values,
            http_headers: transformToFields(values.http_headers),
        };
    return values;
};

export const HostsMutationDialog: FC<HostMutationDialogProps> = ({
    entity,
    inboundId,
    onClose,
    protocol,
}) => {
    const [open, onOpenChange] = useDialog(true);
    const [Schema, ProfileFields, defaultValue] = useProfileStrategy(protocol);
    const form = useForm<HostWithProfileSchemaType>({
        defaultValues: entity ? formMutationToAPIAdapter(entity) : defaultValue,
        resolver: zodResolver(Schema),
    });
    const updateMutation = useHostsUpdateMutation();
    const createMutation = useHostsCreationMutation();
    const { t } = useTranslation();

    // TODO: Refactor value transformation for api using of
    // function composition to pipes and port-adapter patterns.
    // - [ ] ALPN and fingerprint
    // - [ ] HTTP headers (duplex adaptation)
    const submit = (values: HostWithProfileSchemaType) => {
        const host = transformFormValueHttpHeaders(transformFormValue(values));
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
        if (entity) form.reset(formMutationToAPIAdapter(entity));
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
