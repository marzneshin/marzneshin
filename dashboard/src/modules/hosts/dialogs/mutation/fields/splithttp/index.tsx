import {
    CheckboxField,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
    Switch,
} from "@marzneshin/common/components";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SplitHttpModeField } from "./mode";
import { SplitHttpPaddingBytesField } from "./padding-bytes";
import { SplitHttpNoGrpcHeaderField } from "./no-grpc-header";


export const SplitHttpFields = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const split_http = useWatch({ name: "splithttp_settings" });
    const xmux = useWatch({ name: "splithttp_settings.xmux" });
    const isSplitHttpDisabled = split_http === null;
    const isXMuxDisabled = xmux === null;

    const updateFieldValue = (path: string, value: any) => {
        form.setValue(path, value === '' ? null : value, {
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
                                form.setValue("splithttp_settings", checked ? { xmux: {} } : null)
                            }
                        />
                    </FormLabel>

                    {!isSplitHttpDisabled && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <SplitHttpModeField updater={updateFieldValue} />
                                <SplitHttpPaddingBytesField updater={updateFieldValue} />
                                <CheckboxField
                                    name="splithttp_settings.no_grpc_header"
                                    label={t('No GRPC Header')}
                                />
                            </div>

                            <FormLabel className="flex items-center justify-between">
                                {t("page.hosts.xmux-settings")}
                                <Switch
                                    checked={!isSplitHttpDisabled}
                                    onCheckedChange={(checked) =>
                                        form.setValue("splithttp_settings.xmux", checked ? { xmux: {} } : null)
                                    }
                                />
                            </FormLabel>
                            {!isXMuxDisabled && (
                                <div className="grid grid-cols-2 gap-3">
                                    {["max_concurrency", "max_connections", "max_reuse_times", "max_lifetime", "max_request_times", "keep_alive_period"].map(
                                        (fieldName) => (
                                            <FormField
                                                key={fieldName}
                                                name={`splithttp_settings.xmux.${fieldName}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center justify-between capitalize">
                                                            {t(`${fieldName.replace(/_/g, " ")}`)}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                value={field.value}
                                                                onChange={(e) =>
                                                                    updateFieldValue(
                                                                        `splithttp_settings.xmux.${fieldName}`,
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
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </FormItem>
            )}
        />
    );
};
