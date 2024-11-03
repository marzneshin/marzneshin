import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
} from "@marzneshin/common/components";
import { type FC, useMemo } from "react";
import {
    type ServiceType,
    useServicesCreationMutation,
    useServicesUpdateMutation,
} from "@marzneshin/modules/services";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useMutationDialog, MutationDialogProps } from "@marzneshin/common/hooks";
import { NameField, InboundsField } from "./fields";

export const ServiceSchema = z.object({
    id: z.number().optional(),
    inbound_ids: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one inbound.",
    }),
    name: z.string().trim().min(1),
});

export const MutationDialog: FC<MutationDialogProps<ServiceType>> = ({
    entity,
    onClose,
}) => {
    const defaultValue = useMemo(() => ({
        name: "",
        inbound_ids: [],
    }), []);
    const updateMutation = useServicesUpdateMutation();
    const createMutation = useServicesCreationMutation();
    const { open, onOpenChange, form, handleSubmit } = useMutationDialog({
        onClose,
        entity,
        updateMutation,
        createMutation,
        defaultValue,
        schema: ServiceSchema,
    });
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {entity
                            ? t("page.services.dialogs.edition.title")
                            : t("page.services.dialogs.creation.title")}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit} className="h-full">
                        <NameField />
                        <InboundsField />
                        <Button
                            className="mt-3 w-full font-semibold"
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            {t("submit")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
