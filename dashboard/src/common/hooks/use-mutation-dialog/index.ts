import { useDialog } from "@marzneshin/common/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ZodSchema } from "zod";

export interface MutationDialogProps<TData> {
    entity: TData | null;
    onClose: () => void;
}

interface IMutationDialog<TData, TError = unknown, TVariables = unknown> extends MutationDialogProps<TData> {
    createMutation: UseMutationResult<TData, TError, TVariables>
    updateMutation: UseMutationResult<TData, TError, TVariables>
    schema: ZodSchema
    defaultValue: FieldValues
    loadFormtter?: (d: FieldValues) => FieldValues
}

/** useMutationDialog - Dialog mutation hook
 *
 * @param entity - Entity value for update, leave empty for creation 
 * @param createMutation - react-query mutation hook for entity creation
 * @param updateMutation - react-query mutation hook for entity edition
 * @param entity - Entity value for update, leave empty for creation 
 * @param schema - Entity schema validated by zodResolver
 * @param onClose - Handler for when the dialog is closed
 * @param getDefaultValue - Default value function return the default value for function
 *  - Must be wrapped in useCallback to avoid infinite useEffect loop
 *
 * @returns react-hook-form and submit handler plus the dialog open state
 *
 * @template TData - Mutation Type of Schema
 * @template TError = unknown 
 * @template TVariables = unknown
 */

export const useMutationDialog = <TData, TError = unknown, TVariables = unknown>({
    onClose,
    entity,
    createMutation,
    updateMutation,
    schema,
    defaultValue,
    loadFormtter = (s) => s,
}: IMutationDialog<TData, TError, TVariables>) => {
    const [open, onOpenChange] = useDialog(true);

    const form = useForm({
        defaultValues: entity ? loadFormtter(entity) : defaultValue,
        resolver: zodResolver(schema)
    });

    const submit: SubmitHandler<FieldValues> = async (values) => {
        if (entity) {
            updateMutation.mutate(values as TVariables);
        } else {
            createMutation.mutate(values as TVariables);
        }
        onOpenChange(false);
    };

    useEffect(() => {
        if (entity) {
            form.reset(loadFormtter(entity))
        } else {
            form.reset(defaultValue);
        }
        // eslint-disable-next-line
    }, [entity, defaultValue]);

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    const handleSubmit = form.handleSubmit(submit as SubmitHandler<FieldValues>);

    return {
        form,
        open, onOpenChange,
        handleSubmit
    };
};
