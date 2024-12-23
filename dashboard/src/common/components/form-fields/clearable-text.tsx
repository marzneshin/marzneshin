import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";

export const ClearableTextField = ({
    name,
    label,
    placeholder = "",
}: {
    name: string;
    label: string;
    placeholder?: string;
}) => {
    const form = useFormContext();
    const value = form.watch(name);

    const handleNullify = () => {
        form.setValue(name, null);
    };

    const handleRestore = () => {
        form.setValue(name, "");
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative w-full flex items-center gap-2">
                            {value === null ? (
                                <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium">
                                    null
                                </div>
                            ) : (
                                <Input placeholder={placeholder} {...field} />
                            )}
                            <Button
                                type="button"
                                aria-label="clear"
                                variant="ghost"
                                size="icon"
                                onClick={
                                    value === null
                                        ? handleRestore
                                        : handleNullify
                                }
                                className="absolute hover:fg-destructive-background right-1 top-1/2 -translate-y-1/2 h-7"
                            >
                                <X className="h-4 w-4 " />
                                <span className="sr-only">Clear</span>
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
