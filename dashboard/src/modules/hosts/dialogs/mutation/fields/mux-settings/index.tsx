import {
    CheckboxField,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    Input,
} from "@marzneshin/common/components";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ProtocolField } from "./protocol";
import { XudpProxy443Field } from "./xudp-proxy-443";

export const MuxSettingsFields = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const protocol = useWatch({ name: "mux_settings.protocol" });
    const isMuxCool = protocol === "mux_cool";

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
                    <ProtocolField updater={updateFieldValue} />
                    <FormItem className="my-2 w-full">
                        {isMuxCool ? (
                            <div className="grid grid-cols-2 w-full gap-3">
                                {[
                                    "concurrency",
                                    "xudp_connections",
                                ].map((fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        name={`mux_settings.sing_box_mux_settings.${fieldName}`}
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className="flex items-center justify-between capitalize">
                                                    {t(
                                                        `${fieldName.replace(/_/g, " ")}`,
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={field.value}
                                                        type="number"
                                                        onChange={(e) =>
                                                            updateFieldValue(
                                                                `mux_settings.mux_cool_settings.${fieldName}`,
                                                                Number.parseInt(e.target.value),
                                                            )
                                                        }
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <XudpProxy443Field updater={updateFieldValue} />
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
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                updateFieldValue(
                                                                    `mux_settings.sing_box_mux_settings.${fieldName}`,
                                                                    e.target
                                                                        .value,
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
        />
    );
};
