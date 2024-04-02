import {
  FormField,
  FormItem,
  FormLabel,
  Popover,
  PopoverTrigger,
  FormControl,
  PopoverContent,
  Calendar,
  Button,
  FormMessage,
} from '@marzneshin/components'
import { FC, useCallback } from 'react'
import { format, getUTCDate } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@marzneshin/utils'
import { useTranslation } from 'react-i18next'
import { getUTCDateWithoutOffset } from '@marzneshin/utils/utc-date'

interface ExpireDateFieldProps {
  form: any
}

export const ExpireDateField: FC<ExpireDateFieldProps> = (
  { form }
) => {
  const { t } = useTranslation()

  const handleSelect = useCallback((date) => {
    const utcDateWithoutOffset = getUTCDateWithoutOffset(date);
    form.setValue('expire', date);
    console.log('UTC Date without offset:', utcDateWithoutOffset.toISOString());
  }, [form]);
  return (
    <FormField
      control={form.control}
      name="expire"
      render={({ field }) => (
        <FormItem className="flex flex-col mt-2 w-full">
          <FormLabel>{t('page.users.expire_date')}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto w-4 h-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={handleSelect}
                disabled={(date) =>
                  date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
