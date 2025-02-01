import {
    CheckboxField,
    FormField,
    FormItem,
    FormLabel,
    Switch,
} from "@marzneshin/common/components";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SplitHttpModeField } from "./mode";
import { SplitHttpPaddingBytesField } from "./padding-bytes";
import { SplitHttpXmuxFields } from "./xmux";

export const SplitHttpFields = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const split_http = useWatch({ name: "splithttp_settings" });
    const isSplitHttpDisabled = split_http === null;

    const updateFieldValue = (path: string, value: any) => {
        form.setValue(path, value === "" ? null : value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <FormField
            control={form.control}
            name="splithttp_settings"
            render={() => (
                <FormItem className="my-2 w-full">
                    <FormLabel className="flex items-center justify-between">
                        {t("split_http")}
                        <Switch
                            checked={!isSplitHttpDisabled}
                            onCheckedChange={(checked) =>
                                form.setValue(
                                    "splithttp_settings",
                                    checked ? { xmux: {} } : null,
                                )
                            }
                        />
                    </FormLabel>

                    {!isSplitHttpDisabled && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <SplitHttpModeField
                                    updater={updateFieldValue}
                                />
                                <SplitHttpPaddingBytesField
                                    updater={updateFieldValue}
                                />
                                <CheckboxField
                                    name="splithttp_settings.no_grpc_header"
                                    label={t("No GRPC Header")}
                                />
                            </div>
                            <SplitHttpXmuxFields />
                        </>
                    )}
                </FormItem>
            )}
        />
    );
};
