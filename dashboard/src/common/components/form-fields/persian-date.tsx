import { type FC, useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { cn, PersianDateUtils } from "@marzneshin/common/utils";
import { useFormContext, type FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@react-hook/media-query";
import {
    Popover,
    PopoverTrigger,
    FormControl,
    Button,
    Calendar,
    PopoverContent,
    FormLabel,
    FormItem,
    FormField,
    FormMessage,
} from "@marzneshin/common/components";
import { PersianCalendar } from "@marzneshin/common/components/ui/persian-calendar";

interface PersianDateFieldProps {
    name: keyof FieldValues;
    label: string;
}

function parseISODate(isoDateString: string | undefined): Date | undefined {
    if (!isoDateString) return undefined;
    const date = new Date(isoDateString);
    return isNaN(date.getTime()) ? undefined : date;
}

function formatPersianDate(date: Date): string {
    return PersianDateUtils.formatPersianDate(date, 'long');
}

export const PersianDateField: FC<PersianDateFieldProps> = ({ name, label }) => {
    const { t, i18n } = useTranslation();
    const form = useFormContext();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        parseISODate(form.getValues(name)),
    );

    // Check if current language is Persian
    const isPersianLocale = i18n.language === 'fa';
    
    // Check screen size for responsive popover positioning
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const newValue = selectedDate?.toISOString().slice(0, -5);
        const prevValue = form.getValues(name);
        if (newValue !== prevValue) {
            form.setValue(name, newValue, {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
            });
        }
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
                                        !field.value && "text-muted-foreground",
                                    )}
                                >
                                    {field.value ? (
                                        isPersianLocale ? 
                                            formatPersianDate(new Date(field.value + "Z")) :
                                            format(new Date(field.value + "Z"), "PPP")
                                    ) : (
                                        <span>{isPersianLocale ? "انتخاب تاریخ" : "Pick a date"}</span>
                                    )}
                                    <CalendarIcon className="ml-auto w-4 h-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent 
                            className={cn(
                                "p-0 w-auto",
                                isPersianLocale && "persian-calendar-popover"
                            )} 
                            align={isMobile ? "center" : "start"}
                            side="bottom"
                            sideOffset={4}
                            avoidCollisions={true}
                            collisionPadding={10}
                        >
                            {isPersianLocale ? (
                                <PersianCalendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date);
                                    }}
                                    disabled={(date) => date < new Date()}
                                    weekStartsOn={6} // Start week from Saturday for Persian calendar
                                    dir="rtl" // Right-to-left for Persian
                                    initialFocus
                                />
                            ) : (
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                        setSelectedDate(date);
                                    }}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                />
                            )}
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};