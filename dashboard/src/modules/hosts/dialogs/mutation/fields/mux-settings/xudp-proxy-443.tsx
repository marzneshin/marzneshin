import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";

export const XudpProxy443Field = ({
    updater,
}: {
    updater: (field: string, value: any) => void;
}) => {
    const { t } = useTranslation();
    return (
        <FormField
            name="mux_settings.mux_cool_settings.xudp_proxy_443"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("Xudp Proxy 443")}</FormLabel>
                    <Select
                        onValueChange={(value) =>
                            updater(
                                "mux_settings.mux_cool_settings.xudp_proxy_443",
                                value,
                            )
                        }
                        defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="reject">reject</SelectItem>
                            <SelectItem value="allow">allow</SelectItem>
                            <SelectItem value="skip">skip</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
};
