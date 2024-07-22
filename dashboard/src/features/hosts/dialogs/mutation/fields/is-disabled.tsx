import { Switch, FormField, FormControl, FormItem } from "@marzneshin/components";
import { useFormContext } from "react-hook-form";

export const IsDisabled = () => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name="is_disabled"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
