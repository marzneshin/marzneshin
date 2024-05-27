import {
    FormItem,
    FormControl,
    FormMessage,
    FormLabel,
    FormField,
    Checkbox,
    Badge,
} from "@marzneshin/components";
import {
    useInboundsQuery,
    type InboundType,
} from "@marzneshin/features/inbounds";
import {
    useFormContext,
    type FieldValues,
    type ControllerRenderProps,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { cn } from "@marzneshin/utils";
import { Box, GlobeLock } from "lucide-react";

export const InboundCard = ({
    inbound,
    field,
}: {
    inbound: InboundType;
    field: ControllerRenderProps<FieldValues, "inbounds">;
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
                {inbound.tag}
                <div className="flex gap-2">
                    <Badge className="py-1 px-2">
                        {" "}
                        <GlobeLock className="mr-1 w-4" /> {inbound.protocol}{" "}
                    </Badge>
                    <Badge className="py-1 px-2">
                        {" "}
                        <Box className="mr-1 w-4" /> {inbound.node.name}{" "}
                    </Badge>
                </div>
            </FormLabel>
        </div>
    );
};

export const InboundsField = () => {
    const { data: inbounds } = useInboundsQuery();
    const form = useFormContext();
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="inbounds"
            render={() => (
                <FormItem>
                    <FormLabel>{t("inbounds")}</FormLabel>
                    {inbounds.map((inbound) => (
                        <FormField
                            key={inbound.id}
                            control={form.control}
                            name="inbounds"
                            render={({ field }) => (
                                <FormItem key={inbound.id}>
                                    <FormControl>
                                        <InboundCard inbound={inbound} field={field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
