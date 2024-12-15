import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { alpnOptions } from "@marzneshin/modules/hosts";

export const AlpnField = () => {
    const { t } = useTranslation();
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name="alpn"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t("alpn")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select ALPN" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {alpnOptions.map((option) => (<SelectItem value={option}>{option}</SelectItem>))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
