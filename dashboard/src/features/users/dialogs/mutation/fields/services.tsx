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
import { useState } from 'react';
import { ServiceCard } from '@marzneshin/features/users';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ServicesFieldProps {
  services: string[]
  setServices: (s: string[]) => void
}

export const ServicesField: FC<ServicesFieldProps> = (
  { services, setServices }
) => {
  const form = useFormContext()
  const { data } = useServicesQuery()
  const { t } = useTranslation()
  const uniqueServices = Array.from(new Set(services));

  return (
    <FormField
      control={form.control}
      name="services"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('services')}</FormLabel>
          <FormControl>
            <ToggleGroup
              defaultValue={services}
              className="h-full"
              onValueChange={setServices}
              type="multiple"
            >
              <ScrollArea className="flex flex-col justify-start h-full">
                {...data.map((service) => {
                  return (
                    <ToggleGroupItem
                      {...field}
                      value={String(service.id)}
                      key={service.id}
                      className="px-0 mb-1 w-full">
                      <ServiceCard service={service} />
                    </ToggleGroupItem>
                  )
                })}
              </ScrollArea>
            </ToggleGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
