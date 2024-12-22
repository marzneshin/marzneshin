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

    const clearFieldValue = () => {
        form.setValue(name, "", {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="relative w-full max-w-sm flex items-center gap-2">
                            <Input placeholder={placeholder} {...field} />
                            <Button
                                type="button"
                                aria-label="clear"
                                variant="ghost"
                                size="icon"
                                onClick={clearFieldValue}
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
