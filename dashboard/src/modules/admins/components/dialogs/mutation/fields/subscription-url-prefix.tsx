import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage,
} from "@marzneshin/common/components";
import type { FC, InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SubscriptionUrlPrefixField: FC<InputHTMLAttributes<HTMLElement>> = ({
    disabled,
}) => {
    const form = useFormContext();
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="subscription_url_prefix"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("page.admins.subscription-url-prefix")}</FormLabel>
                    <FormControl>
                        <Input disabled={disabled} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
