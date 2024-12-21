import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";


export const SplitHttpPaddingBytesField = (
    { updater }: { updater: (field: string, value: any) => void }
) => {
    const { t } = useTranslation();
    return (
        <FormField
            name="splithttp_settings.padding_bytes"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {t("Padding Bytes")}
                    </FormLabel>
                    <FormControl>
                        <Input
                            value={field.value}
                            onChange={(e) =>
                                updater(
                                    "splithttp_settings.padding_bytes",
                                    e.target.value
                                )
                            }
                            className="w-full"
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
