import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const WeightField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem className="w-1/3">
                    <FormLabel>{t('weight')}</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
