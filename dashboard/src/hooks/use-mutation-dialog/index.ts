
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ZodSchema } from "zod";

interface IMutationDialog<TData, TError = unknown, TVariables = unknown> {
    entity: TData | null
    onOpenChange: (s: boolean) => void
    createMutation: UseMutationResult<TData, TError, TVariables>
    updateMutation: UseMutationResult<TData, TError, TVariables>
    schema: ZodSchema
    getDefaultValue: () => FieldValues
}

/** useMutationDialog - Dialog mutation hook
 *
 * @param entity - Entity value for update, leave empty for creation 
 * @param createMutation - react-query mutation hook for entity creation
 * @param updateMutation - react-query mutation hook for entity edition
 * @param entity - Entity value for update, leave empty for creation 
 * @param schema - Entity schema validated by zodResolver
 * @param getDefaultValue - Default value function return the default value for function
 *  - Must be wrapped in useCallback to avoid infinite useEffect loop
 * @param onOpenChange - Dialog state callback to change the dialog openness state
 *
 * @returns react-hook-form and submit handler 
 *
 * @template TData - Mutation Type of Schema
 * @template TError = unknown 
 * @template TVariables = unknown
 */
export const useMutationDialog = <TData, TError = unknown, TVariables = unknown>({
    entity,
    onOpenChange,
    createMutation,
    updateMutation,
    schema,
    getDefaultValue,
}: IMutationDialog<TData, TError, TVariables>) => {
    const form = useForm({
        defaultValues: entity ? (entity as FieldValues) : (getDefaultValue()),
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
            form.reset(entity)
        } else {
            form.reset(getDefaultValue());
        }
    }, [entity, form, getDefaultValue]);

    const handleSubmit = form.handleSubmit(submit as SubmitHandler<FieldValues>);

    return {
        form,
        handleSubmit
    };
};
