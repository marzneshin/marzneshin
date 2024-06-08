import {
    DialogTitle,
    DialogContent,
    Dialog,
    DialogHeader,
    Form,
    Button,
} from "@marzneshin/components";
import { type FC, useEffect } from "react";
import {
    type ServiceType,
    useServicesCreationMutation,
    useServicesUpdateMutation,
} from "@marzneshin/features/services";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useMutationDialog } from "@marzneshin/hooks";
import { NameField, InboundsField } from "./fields";

export const ServiceSchema = z.object({
    id: z.number().optional(),
    inbound_ids: z.array(z.number()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one inbound.",
    }),
    name: z.string().trim().min(1),
});

type ServiceCreateType = z.infer<typeof ServiceSchema>;

interface MutationDialogProps {
    entity: ServiceType | null;
    open: boolean;
    onOpenChange: (state: boolean) => void;
    onClose: () => void;
}

const getDefaultValues = (): ServiceCreateType => ({
    name: "",
    inbound_ids: [],
});

export const MutationDialog: FC<MutationDialogProps> = ({
    entity,
    open,
    onOpenChange,
    onClose,
}) => {
    const isEditing = entity !== null;
    const updateMutation = useServicesUpdateMutation();
    const createMutation = useServicesCreationMutation();
    const { form, handleSubmit } = useMutationDialog({
        entity,
        updateMutation,
        createMutation,
        getDefaultValue: getDefaultValues,
        schema: ServiceSchema,
        onOpenChange,
    });
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {isEditing
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
