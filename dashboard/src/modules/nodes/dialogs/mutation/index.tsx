import { type FC, useMemo } from "react";
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
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    FormDescription,
    HStack,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";
import {
    NodeSchema,
    useNodesCreationMutation,
    useNodesUpdateMutation,
} from "../..";
import type { NodeType } from "../..";
import { useMutationDialog, MutationDialogProps } from "@marzneshin/common/hooks";

export const MutationDialog: FC<MutationDialogProps<NodeType>> = ({
    entity,
    onClose,
}) => {
    const updateMutation = useNodesUpdateMutation();
    const createMutation = useNodesCreationMutation();
    const { t } = useTranslation();

    const defaultValue = useMemo(() => ({
        id: 0,
        name: "",
        address: "",
        status: "none",
        port: 62050,
        usage_coefficient: 1,
        connection_backend: "grpclib",
    }), []);

    const { onOpenChange, open, form, handleSubmit } = useMutationDialog({
        entity,
        onClose,
        schema: NodeSchema,
        createMutation,
        updateMutation,
        defaultValue,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-primary">
                        {entity
                            ? t("page.nodes.dialogs.edition.title")
                            : t("page.nodes.dialogs.creation.title")}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleSubmit}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>{t("name")}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row gap-2 items-center">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="w-2/3">
                                        <FormLabel>{t("address")}</FormLabel>
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
                                        <FormLabel>{t("port")}</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <HStack>
                            <FormField
                                control={form.control}
                                name="connection_backend"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>{t("page.nodes.connection_backend")}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Nodes Connection" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="grpclib">grpclib</SelectItem>
                                                <SelectItem value="grpcio">grpcio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            {t("page.nodes.connection_backend_desc")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="usage_coefficient"
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        <FormLabel>{t("page.nodes.usage_coefficient")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </HStack>
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
