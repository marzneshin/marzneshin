import {
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormControl,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const UpdateIntervalField = () => {
    const { t } = useTranslation()
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="update_interval"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("page.settings.subscription-settings.update-interval")}</FormLabel>
                    <FormControl>
                        <Input
                            className="h-8"
                            type="number"
                            {...field}
                            {...form.register('update_interval', { valueAsNumber: true })}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
