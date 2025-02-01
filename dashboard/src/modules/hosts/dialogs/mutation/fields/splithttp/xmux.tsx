import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
    Switch,
} from "@marzneshin/common/components";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const SplitHttpXmuxFields = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const xmux = useWatch({ name: "splithttp_settings.xmux" });
    const isXMuxDisabled = xmux === null;

    const updateFieldValue = (path: string, value: any) => {
        form.setValue(path, value === "" ? null : value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <div>
            <FormLabel className="flex items-center justify-between">
                {t("page.hosts.xmux-settings")}
                <Switch
                    checked={!isXMuxDisabled}
                    onCheckedChange={(checked) =>
                        form.setValue(
                            "splithttp_settings.xmux",
                            checked ? { xmux: {} } : null,
                        )
                    }
                />
            </FormLabel>
            {!isXMuxDisabled && (
                <div className="grid grid-cols-2 gap-3">
                    {[
                        "max_concurrency",
                        "max_connections",
                        "max_reuse_times",
                        "max_lifetime",
                        "max_request_times",
                    ].map((fieldName) => (
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
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                    <FormField
                        key="keep_alive_period"
                        name={`splithttp_settings.xmux.keep_alive_period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center justify-between capitalize">
                                    Keep Alive Period
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        value={field.value}
                                        type="number"
                                        onChange={(e) =>
                                            updateFieldValue(
                                                `splithttp_settings.xmux.keep_alive_period`,
                                                e.target.value === ""
                                                    ? null
                                                    : Number.parseInt(
                                                          e.target.value,
                                                      ),
                                            )
                                        }
                                        className="w-full"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </div>
    );
};
