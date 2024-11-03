import {
    Button,
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage,
} from "@marzneshin/common/components";
import { type FC } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const PasswordField: FC<{ change: boolean, handleChange: (s: boolean) => void }> = ({
    change, handleChange
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
                        {change ?
                            (<Input type="password" {...field} />)
                            : (
                                <Button
                                    className="border w-full"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleChange(true);
                                    }}
                                >
                                    {t("change")}
                                </Button>
                            )
                        }
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
