import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Button
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export const PathField = ({ label }: { label?: string }) => {
    const { t } = useTranslation();
    const form = useFormContext();

    const value = form.watch("path"); // Watch the `path` value for changes.

    const handleNullify = () => {
        form.setValue("path", null); // Set the `path` field to `null` in the form state.
    };

    const handleRestore = () => {
        form.setValue("path", ""); // Set the `path` field to an empty string or any default value.
    };

    return (
        <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label ?? t("path")}</FormLabel>
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
};
