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

export const RemarkField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('name')}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
