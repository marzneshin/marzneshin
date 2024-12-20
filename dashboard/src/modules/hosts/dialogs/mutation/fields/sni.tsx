import { Button, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export const SniField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    const value = form.watch("sni");

    const handleNullify = () => {
        form.setValue("sni", null);
    };

    const handleRestore = () => {
        form.setValue("sni", "");
    };

    return (
        <FormField
            control={form.control}
            name="sni"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t("sni")}</FormLabel>
                    <FormControl>
                        {value === null ? ( // Check if the value is null.
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-full px-3 py-2 border rounded-md text-gray-500 bg-gray-50 focus-within:ring focus-within:outline-none focus-within:ring-blue-500">
                                    {t("inherited")}
                                </div>
                                {/* Restore button to enable the input */}
                                <Button
                                    type="button"
                                    aria-label={t("restore_field")}
                                    onClick={handleRestore}
                                    className="p-1"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Input {...field} />
                                {/* X button to nullify */}
                                <Button
                                    type="button"
                                    aria-label={t("nullify_field")}
                                    onClick={handleNullify}
                                    className="p-1"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
