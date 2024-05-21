import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@marzneshin/components";
import { PopoverGuide } from './popover-guide';
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InfoIcon } from 'lucide-react';

export const RemarkField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex flex-row items-center gap-2">
                        {t('name')}
                        <Popover>
                            <PopoverTrigger>
                                <InfoIcon className="size-5" />
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <PopoverGuide />
                            </PopoverContent>
                        </Popover>
                    </FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
