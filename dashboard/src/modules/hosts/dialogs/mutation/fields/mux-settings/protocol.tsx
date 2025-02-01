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

export const ProtocolField = ({
    updater,
}: {
    updater: (field: string, value: any) => void;
}) => {
    const { t } = useTranslation();
    return (
        <FormField
            name="mux_settings.protocol"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t("protocol")}</FormLabel>
                    <Select
                        onValueChange={(value) =>
                            updater("mux_settings.protocol", value)
                        }
                        defaultValue={field.value ? field.value : "mux_cool"}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="mux_cool">Mux Cool</SelectItem>
                            <SelectItem value="h2mux">h2mux</SelectItem>
                            <SelectItem value="yamux">yamux</SelectItem>
                            <SelectItem value="smux">smux</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            )}
        />
    );
};
