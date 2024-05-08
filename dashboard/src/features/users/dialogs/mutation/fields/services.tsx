import {
    Checkbox,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    ScrollArea,
} from '@marzneshin/components';
import { useServicesQuery } from '@marzneshin/features/services';
import { ServiceCard } from '@marzneshin/features/users';
import { cn } from '@marzneshin/utils';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ServicesFieldProps { }

export const ServicesField: FC<ServicesFieldProps> = () => {
    const form = useFormContext();
    const { data } = useServicesQuery({ page: 1, size: 100 });
    const { t } = useTranslation();

    console.log(form.getValues().services)
    return (
        <FormField
            control={form.control}
            name="services"
            render={() => (
                <FormItem>
                    <FormLabel>{t('services')}</FormLabel>
                    <ScrollArea className="flex flex-col justify-start px-1 h-[22rem]">
                        {data.entity.map(service => (
                                <FormField
                                    control={form.control}
                                    name='services'
                                    render={({ field }) => (
                                        <FormItem key={service.id}>
                                            <FormControl>
                                                <div
                                                    className={cn("flex mb-2 flex-row gap-2 items-center p-3 rounded-md border", { "bg-secondary": field.value?.includes(service.id) })}>
                                                    <Checkbox
                                                        checked={field.value?.includes(service.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, service.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value: number) => value !== service.id
                                                                    )
                                                                )
                                                        }}
                                                    />
                                                    <FormLabel className="flex flex-row justify-between items-center w-full">
                                                        <ServiceCard service={service} />
                                                    </FormLabel>
                                                </div>
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
