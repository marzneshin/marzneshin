import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ScrollArea,
  Toggle
} from '@marzneshin/components';
import { useServicesQuery } from '@marzneshin/features/services';
import { ServiceCard } from '@marzneshin/features/users';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ServicesFieldProps { }

export const ServicesField: FC<ServicesFieldProps> = () => {
  const form = useFormContext();
  const { data } = useServicesQuery({ page: 1, size: 100 });
  const { t } = useTranslation();

  return (
    <FormItem>
      <FormLabel>{t('services')}</FormLabel>
      <ScrollArea className="flex flex-col justify-start px-1 h-[22rem]">
        {data.entity.map(service => (
          <FormField
            control={form.control}
            name={`services`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Toggle
                    key={service.id}
                    value={String(service.id)}
                    pressed={field.value?.includes(service.id)}
                    onPressedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, service.id])
                        : field.onChange(
                          field.value?.filter(
                            (value: number) => value !== service.id
                          )
                        )
                    }}
                    {...form.register(`services.${service.id}`, { shouldUnregister: true })}
                    className="px-0 mb-1 w-full"
                  >
                    <ServiceCard service={service} />
                  </Toggle>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </ScrollArea>
    </FormItem>
  );
};
