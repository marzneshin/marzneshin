import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from "@marzneshin/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SniField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="sni"
            render={({ field }) => (
                <FormItem >
                    <FormLabel>{t('SNI')}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
