import {
    FormField,
    FormItem,
    FormLabel,
    Input,
    FormControl,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SupportLinkField = () => {
    const { t } = useTranslation()
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="support_link"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("page.settings.subscription-settings.support-link")}</FormLabel>
                    <FormControl>
                        <Input className="h-8" {...field} />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
