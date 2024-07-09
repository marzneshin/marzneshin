import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage,
} from "@marzneshin/components";
import type { FC, InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const PasswordField: FC<InputHTMLAttributes<HTMLElement>> = ({
    disabled,
}) => {
    const form = useFormContext();
    const { t } = useTranslation();

    return (
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                        <Input disabled={disabled} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
