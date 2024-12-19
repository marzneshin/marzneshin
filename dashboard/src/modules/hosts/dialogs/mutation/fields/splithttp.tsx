import {
    Accordion,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    HStack,
    Input,
    Switch
} from "@marzneshin/common/components";
import {useFormContext, useWatch} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {SettingSection} from "@marzneshin/modules/hosts";


// Main SplitHttpField Component
export const SplitHttpField = () => {
    const {t} = useTranslation();
    const form = useFormContext();
    // const errors = form.formState.errors as FieldErrors<SplitHttpForm>;
    const split_http = useWatch({name: "splithttp_settings"});

    const isDisabled = split_http === null;

    /**
     * Enable or disable a field by setting its value to `null` (disabled) or a default value (enabled).
     */
    const toggleField = (path: string, isEnabled: boolean, defaultValue: any = "") => {
        form.setValue(path, isEnabled ? defaultValue : null, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    /**
     * Update the value of a field while keeping the form state clean.
     */
    const updateFieldValue = (path: string, value: any) => {
        form.setValue(path, value, {
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
                            checked={!isDisabled}
                            onCheckedChange={(checked) =>
                                form.setValue("splithttp_settings", checked ? {xmux: {}} : null)
                            }
                        />
                    </FormLabel>

                    {!isDisabled && (
                        <div className="space-y-4">
                            {/* Mode Field */}
                            <HStack>
                                <FormField
                                    name="splithttp_settings.mode"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center justify-between">
                                                {t("Mode")}
                                                <Switch
                                                    checked={field.value !== null}
                                                    onCheckedChange={(checked) =>
                                                        toggleField("splithttp_settings.mode", checked, "")
                                                    }
                                                />
                                            </FormLabel>
                                            {field.value !== null && (
                                                <FormControl>
                                                    <Input
                                                        value={field.value}
                                                        onChange={(e) => updateFieldValue("splithttp_settings.mode", e.target.value)}
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                {/* Padding Bytes Field */}
                                <FormField
                                    name="splithttp_settings.padding_bytes"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center justify-between">
                                                {t("Padding Bytes")}
                                                <Switch
                                                    checked={field.value !== null}
                                                    onCheckedChange={(checked) =>
                                                        toggleField("splithttp_settings.padding_bytes", checked, "")
                                                    }
                                                />
                                            </FormLabel>
                                            {field.value !== null && (
                                                <FormControl>
                                                    <Input
                                                        value={field.value}
                                                        onChange={(e) =>
                                                            updateFieldValue(
                                                                "splithttp_settings.padding_bytes",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                {/* No gRPC Header Field */}
                                <FormField
                                    name="splithttp_settings.no_grpc_header"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center justify-between">
                                                {t("No GRPC Header")}
                                                <Switch
                                                    checked={field.value !== null}
                                                    onCheckedChange={(checked) =>
                                                        toggleField("splithttp_settings.no_grpc_header", checked, false)
                                                    }
                                                />
                                            </FormLabel>
                                            {field.value !== null && (
                                                <FormControl>
                                                    <Input
                                                        type="checkbox"
                                                        checked={!!field.value}
                                                        onChange={(e) =>
                                                            updateFieldValue(
                                                                "splithttp_settings.no_grpc_header",
                                                                e.target.checked
                                                            )
                                                        }
                                                        className="rounded cursor-pointer"
                                                    />
                                                </FormControl>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </HStack>
                            {/* XMux Settings Fields */}
                            <Accordion type="single" collapsible>
                                <SettingSection value="xmux" triggerText={t("Xmux Settings")}>
                                    <div className="mt-4">
                                        <FormLabel>{t("XMux Settings")}</FormLabel>
                                        {["max_concurrency", "max_connections", "max_reuse_times", "max_lifetime"].map(
                                            (fieldName) => (
                                                <FormField
                                                    key={fieldName}
                                                    name={`splithttp_settings.xmux.${fieldName}`}
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel className="flex items-center justify-between">
                                                                {t(`${fieldName.replace(/_/g, " ")}`)}
                                                                <Switch
                                                                    checked={field.value !== null}
                                                                    onCheckedChange={(checked) =>
                                                                        toggleField(
                                                                            `splithttp_settings.xmux.${fieldName}`,
                                                                            checked,
                                                                            ""
                                                                        )
                                                                    }
                                                                />
                                                            </FormLabel>
                                                            {field.value !== null && (
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
                                                            )}
                                                        </FormItem>
                                                    )}
                                                />
                                            )
                                        )}
                                    </div>
                                </SettingSection>
                            </Accordion>
                        </div>
                    )}
                </FormItem>
            )}
        />
    );
};