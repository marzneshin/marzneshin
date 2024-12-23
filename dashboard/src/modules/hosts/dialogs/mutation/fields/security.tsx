import {
    ClearableTextField,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@marzneshin/common/components";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AllowInsecureField, AlpnField, FingerprintField } from ".";

export const SecurityFields = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const security = form.watch().security;

    const [extraSecurity, setExtraSecurity] = useState<boolean>(
        ["tls", "inbound_default"].includes(security),
    );
    useEffect(() => {
        setExtraSecurity(["tls", "inbound_default"].includes(security));
    }, [security, setExtraSecurity]);

    return (
        <>
            <FormField
                control={form.control}
                name="security"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t("security")}</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a verified email to display" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="tls">TLS</SelectItem>
                                <SelectItem value="inbound_default">
                                    Inbound Default
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {extraSecurity && (
                <div className="w-full flex flex-col gap-2">
                    <ClearableTextField name="sni" label={t("sni")} />
                    <div className="flex flex-row w-full gap-2">
                        <AlpnField />
                        <FingerprintField />
                    </div>
                    <AllowInsecureField />
                </div>
            )}
        </>
    );
};
