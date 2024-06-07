import {
    Checkbox,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    ScrollArea,
} from "@marzneshin/components";
import {
    useServicesQuery,
    type ServiceType,
} from "@marzneshin/features/services";
import { ServiceCard } from "@marzneshin/features/users";
import { cn } from "@marzneshin/utils";
import type { FC } from "react";
import {
    useFormContext,
    type FieldValues,
    type ControllerRenderProps,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ServiceCheckboxCardProps {
    service: ServiceType;
    field: ControllerRenderProps<FieldValues, "service_ids">;
}

const ServiceCheckboxCard: FC<ServiceCheckboxCardProps> = ({
    service,
    field,
}) => {
    return (
        <div
            className={cn(
                "flex mb-2 flex-row gap-2 items-center p-3 rounded-md border",
                { "bg-secondary": field.value?.includes(service.id) },
            )}
        >
            <Checkbox
                checked={field.value?.includes(service.id)}
                onCheckedChange={(checked) => {
                    return checked
                        ? field.onChange([...field.value, service.id])
                        : field.onChange(
                            field.value?.filter((value: number) => value !== service.id),
                        );
                }}
            />
            <FormLabel className="flex flex-row justify-between items-center w-full">
                <ServiceCard service={service} />
            </FormLabel>
        </div>
    );
};

export const ServicesField: FC = () => {
    const form = useFormContext();
    const { data } = useServicesQuery({ page: 1, size: 100 });
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="service_ids"
            render={() => (
                <FormItem>
                    <FormLabel>{t("services")}</FormLabel>
                    <ScrollArea className="flex flex-col justify-start px-1 h-full max-h-[20rem]">
                        {data.entity.map((service) => (
                            <FormField
                                key={service.id}
                                control={form.control}
                                name="service_ids"
                                render={({ field }) => (
                                    <FormItem key={service.id}>
                                        <FormControl>
                                            <ServiceCheckboxCard service={service} field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </ScrollArea>
                </FormItem>
            )}
        />
    );
};
