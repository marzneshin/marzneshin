import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";

export const SplitHttpNoGrpcHeaderField = (
    { updater }: { updater: (field: string, value: any) => void }
) => {
    const { t } = useTranslation();
    return (
        <FormField
            name="splithttp_settings.no_grpc_header"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center justify-between">
                        {t("page.hosts.no-grpc-header")}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type="checkbox"
                            checked={!!field.value}
                            onChange={(e) =>
                                updater(
                                    "splithttp_settings.no_grpc_header",
                                    e.target.checked
                                )
                            }
                            className="rounded cursor-pointer"
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
