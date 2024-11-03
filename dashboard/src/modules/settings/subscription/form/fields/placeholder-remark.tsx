import {
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormControl,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@marzneshin/common/components";
import { PopoverGuide } from "@marzneshin/modules/hosts";
import { InfoIcon } from 'lucide-react';
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const PlaceholderRemarkField = () => {
    const { t } = useTranslation()
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="placeholder_remark"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex flex-row items-center gap-2">
                        {t("page.settings.subscription-settings.placeholder-remark")}
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
                        <Input className="h-8" {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
