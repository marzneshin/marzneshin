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

export const AddressField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
                <FormItem className="w-2/3">
                    <FormLabel>{t('address')}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

