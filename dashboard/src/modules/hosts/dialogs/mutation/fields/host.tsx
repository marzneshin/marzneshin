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

export const HostField = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t("host")}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
