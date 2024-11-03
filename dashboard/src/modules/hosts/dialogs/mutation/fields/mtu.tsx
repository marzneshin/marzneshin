import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from "@marzneshin/common/components";
import { useFormContext } from "react-hook-form";

export const MtuField = () => {
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="mtu"
            render={({ field }) => (
                <FormItem className="w-1/3">
                    <FormLabel>MTU</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
