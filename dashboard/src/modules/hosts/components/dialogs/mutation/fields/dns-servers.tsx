import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const DNSServersField = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="dns_servers"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t("page.hosts.dns-servers")}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
