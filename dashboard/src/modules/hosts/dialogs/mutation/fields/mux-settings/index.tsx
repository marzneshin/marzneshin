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
import { ProtocolField } from "./protocol";
import { XudpProxy443Field } from "./xudp-proxy-443";

export const MuxSettingsFields = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const mux_settings = useWatch({ name: "mux_settings" });
    const protocol = useWatch({ name: "mux_settings.protocol" });
    const isMuxCool = protocol === "mux_cool";
    const isMuxSettingsDisabled = mux_settings === null;

    const updateFieldValue = (path: string, value: any) => {
        form.setValue(path, value === "" ? null : value, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <FormField
            control={form.control}
            name="mux_settings"
            render={() => (
                <>
                    <FormLabel className="flex items-center justify-between">
                        {t("page.hosts.mux-settings")}
                        <Switch
                            checked={!isMuxSettingsDisabled}
                            onCheckedChange={(checked) =>
                                form.setValue(
                                    "mux_settings",
                                    checked
                                        ? {
                                              protocol: "mux_cool",
                                              mux_cool_settings: {
                                                  xudp_proxy_443: "reject",
                                              },
                                          }
                                        : null,
                                )
                            }
                        />
                    </FormLabel>

                    {!isMuxSettingsDisabled && (
                        <>
                            <ProtocolField updater={updateFieldValue} />
                            <FormItem className="my-2 w-full">
                                {isMuxCool ? (
                                    <div className="grid grid-cols-2 w-full gap-3">
                                        {[
                                            "concurrency",
                                            "xudp_concurrency",
                                        ].map((fieldName) => (
                                            <FormField
                                                key={fieldName}
                                                name={`mux_settings.mux_cool_settings.${fieldName}`}
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="flex items-center justify-between capitalize">
                                                            {t(
                                                                `${fieldName.replace(/_/g, " ")}`,
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                value={
                                                                    field.value
                                                                }
                                                                type="number"
                                                                onChange={(e) =>
                                                                    updateFieldValue(
                                                                        `mux_settings.mux_cool_settings.${fieldName}`,
                                                                        e.target
                                                                            .value ===
                                                                            ""
                                                                            ? null
                                                                            : Number.parseInt(
                                                                                  e
                                                                                      .target
                                                                                      .value,
                                                                              ),
                                                                    )
                                                                }
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                        <XudpProxy443Field
                                            updater={updateFieldValue}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col  w-full">
                                        <div className="grid grid-cols-2 gap-3 w-full">
                                            {[
                                                "max_connections",
                                                "max_streams",
                                                "min_streams",
                                            ].map((fieldName) => (
                                                <FormField
                                                    key={fieldName}
                                                    name={`mux_settings.sing_box_mux_settings.${fieldName}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center justify-between capitalize">
                                                                {t(
                                                                    `${fieldName.replace(/_/g, " ")}`,
                                                                )}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    type="number"
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateFieldValue(
                                                                            `mux_settings.sing_box_mux_settings.${fieldName}`,
                                                                            e
                                                                                .target
                                                                                .value ===
                                                                                ""
                                                                                ? null
                                                                                : Number.parseInt(
                                                                                      e
                                                                                          .target
                                                                                          .value,
                                                                                  ),
                                                                        )
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <CheckboxField
                                            name="mux_settings.sing_box_mux_settings.padding"
                                            label={t("page.hosts.padding")}
                                        />
                                    </div>
                                )}
                            </FormItem>
                        </>
                    )}
                </>
            )}
        />
    );
};
