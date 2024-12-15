import {
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
    FormField,
    Checkbox,
    ScrollArea,
    EntityFieldCard,
} from "@marzneshin/common/components";
import {
    useInboundsQuery,
    type InboundType,
} from "@marzneshin/modules/inbounds";
import {
    useFormContext,
    type FieldValues,
    type ControllerRenderProps,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@marzneshin/common/utils";
import { Box, GlobeLock } from "lucide-react";

export const InboundCard = ({
    inbound,
    field,
}: {
    inbound: InboundType;
    field: ControllerRenderProps<FieldValues, "inbound_ids">;
}) => {
    return (
        <div
            className={cn(
                "flex flex-row items-center p-3 space-y-0 space-x-3 rounded-md border",
                {
                    "bg-secondary": field.value?.includes(inbound.id),
                },
            )}
        >
            <Checkbox
                checked={field.value?.includes(inbound.id)}
                onCheckedChange={(checked) => {
                    return checked
                        ? field.onChange([...field.value, inbound.id])
                        : field.onChange(
                            field.value?.filter((value: number) => value !== inbound.id),
                        );
                }}
            />
            <FormLabel className="flex flex-row justify-between items-center w-full">
                <EntityFieldCard
                    FirstIcon={GlobeLock}
                    SecondIcon={Box}
                    firstAmount={inbound.protocol}
                    secondAmount={inbound.node.name}
                    name={inbound.tag}
                />
            </FormLabel>
        </div>
    );
};

export const InboundsField = () => {
    const { data } = useInboundsQuery({ page: 1, size: 100 });
    const form = useFormContext();
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="inbound_ids"
            render={() => (
                <FormItem>
                    <FormLabel>{t("inbounds")}</FormLabel>
                    <ScrollArea className="flex flex-col justify-start  h-full max-h-[20rem]">
                        {data.entities.map((inbound) => (
                            <FormField
                                key={inbound.id}
                                control={form.control}
                                name="inbound_ids"
                                render={({ field }) => (
                                    <FormItem key={inbound.id} className="mb-1">
                                        <FormControl>
                                            <InboundCard inbound={inbound} field={field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ))}
                    </ScrollArea>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
