import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@marzneshin/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const PathField = ({ label }: { label?: string }) => {
    const { t } = useTranslation();
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label ?? t("path")}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
