import {
    FormControl,
    FormField,
    FormItem,
    Textarea,
    FormLabel,
    FormMessage,
} from "@marzneshin/common/components";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface AllowedIpsFieldProps { }

export const AllowedIpsField: FC<AllowedIpsFieldProps> = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="allowed_ips"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("page.hosts.allowed-ips")}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={t("page.hosts.allowed-ips-placeholder")}
                            className="resize-none"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
