import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ToggleGroup,
  ToggleGroupItem,
  ScrollArea
} from '@marzneshin/components';
import { useServicesQuery } from '@marzneshin/features/services';
import { ServiceCard } from '@marzneshin/features/users';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ServicesFieldProps {
  services: number[]
  setServices: (s: number[]) => void
}

export const ServicesField: FC<ServicesFieldProps> = ({
  services,
  setServices
}) => {
  const form = useFormContext();
  const { data } = useServicesQuery({ page: 1, size: 100 });
  const { t } = useTranslation();

  const handleToggle = (selectedServiceIds: string[]) => {
    setServices(selectedServiceIds.map(Number));
  };

  return (
    <FormField
      control={form.control}
      name="services"
      render={() => (
        <FormItem>
          <FormLabel>{t('services')}</FormLabel>
          <FormControl>
            <ToggleGroup
              defaultValue={services.map(String)}
              className="h-full"
              onValueChange={handleToggle}
              type="multiple"
            >
              <ScrollArea className="flex flex-col justify-start px-1 h-[22rem]">
                {data.entity.map(service => (
                  <ToggleGroupItem
                    key={service.id}
                    value={String(service.id)}
                    {...form.register(`services.${service.id}`)}
                    className="px-0 mb-1 w-full"
                  >
                    <ServiceCard service={service} />
                  </ToggleGroupItem>
                ))}
              </ScrollArea>
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
