import {
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormControl,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const UrlPrefixField = () => {
    const { t } = useTranslation()
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="url_prefix"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("page.settings.subscription-settings.url-prefix")}</FormLabel>
                    <FormControl>
                        <Input className="h-8" {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
