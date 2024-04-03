import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { cn } from '@marzneshin/utils';
import { useFormContext, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverTrigger, FormControl, Button, Calendar, PopoverContent, FormLabel, FormItem, FormField, FormMessage } from '@marzneshin/components';

interface DateFieldProps {
    name: keyof FieldValues;
    label: string;
}

function parseISODate(isoDateString: string | undefined): Date | undefined {
    if (!isoDateString) return undefined;
    const date = new Date(isoDateString);
    return isNaN(date.getTime()) ? undefined : date;
}

export const DateField: FC<DateFieldProps> = ({ name, label }) => {
    const { t } = useTranslation();
    const form = useFormContext();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(parseISODate(form.getValues(name)));

    useEffect(() => {
        // Set up the form value when the component mounts
        form.setValue(name, selectedDate?.toISOString().slice(0, -5)); // Ensure that the timezone offset is removed
    }, [form, name, selectedDate]);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col mt-2 w-full">
                    <FormLabel>{t(label)}</FormLabel>
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
                                    setSelectedDate(date);
                                }}
                                onFinalize={(date) => {
                                    form.setValue(name, date?.toISOString().slice(0, -5), { shouldValidate: true });
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
};
