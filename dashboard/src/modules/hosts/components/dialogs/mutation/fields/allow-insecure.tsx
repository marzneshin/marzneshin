
import {
    Alert,
    AlertDescription,
    AlertTitle,
    Checkbox,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@marzneshin/common/components";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const AllowInsecureField = () => {
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="allowinsecure"
            render={({ field }) => (
                <FormItem className="my-2">
                    <FormControl>
                        <div className="flex flex-row gap-1 items-center">
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            <FormLabel>
                                {t('page.hosts.allowinsecure')}
                            </FormLabel>
                        </div>
                    </FormControl>
                    <FormMessage />
                    {form.getValues().allowinsecure &&
                        <Alert variant="destructive">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            <AlertTitle>
                                Warning
                            </AlertTitle>
                            <AlertDescription>
                                {t('page.hosts.dialogs.mutation.allowinsecure.alert')}
                            </AlertDescription>
                        </Alert>}
                </FormItem>
            )}
        />
    )
}
