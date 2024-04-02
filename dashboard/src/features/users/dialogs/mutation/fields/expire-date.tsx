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
import { FC, useState } from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@marzneshin/utils'
import { useTranslation } from 'react-i18next'

interface ExpireDateFieldProps {
  form: any
}


function parseISODate(isoDateString: string | undefined): Date | undefined {
  if (!isoDateString) return undefined;
  const date = new Date(isoDateString);
  return isNaN(date.getTime()) ? undefined : date;
}

export const ExpireDateField: FC<ExpireDateFieldProps> = (
  { form }
) => {
  const { t } = useTranslation()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISODate(form.getValues('expire')));
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
                selected={selectedDate}
                onSelect={(date) => {
                  form.setValue('expire', date?.toISOString().slice(0, -5));
                  setSelectedDate(date);
                }}
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
