import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const EarlyDataField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="early_data"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t('page.hosts.early-data')}</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
