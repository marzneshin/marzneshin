import {
    FormField,
    FormItem,
    FormLabel,
    Checkbox,
    FormControl,
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";

export const CheckboxField = ({ name, label }: { name: string, label: string }) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-2">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>
                            {label}
                        </FormLabel>
                    </div>
                </FormItem>
            )}
        />
    )
}
