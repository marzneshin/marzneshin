import {
    CommonFields,
    EarlyDataField,
    FragmentField,
    HttpHeadersDynamicFields,
    MuxSettingsFields,
    NoiseField,
    SecurityFields,
    SplitHttpFields,
} from "../../fields";
import {
    Accordion,
    ClearableTextField,
    HStack,
} from "@marzneshin/common/components";
import { SettingSection } from "@marzneshin/modules/hosts";
import { useTranslation } from "react-i18next";

export const GeneralProfileFields = () => {
    const { t } = useTranslation();

    return (
        <div className="space-y-2">
            <CommonFields />
            <Accordion className="space-y-2" type="single" collapsible>
                <SettingSection
                    value="network"
                    triggerText={t("page.hosts.network-settings")}
                >
                    <HStack>
                        <ClearableTextField name="host" label={t("host")} />
                        <ClearableTextField name="path" label={t("path")} />
                    </HStack>
                    <EarlyDataField />
                    <HttpHeadersDynamicFields />
                </SettingSection>
                <SettingSection
                    value="split-http"
                    triggerText={t("page.hosts.split-http-settings")}
                >
                    <SplitHttpFields />
                </SettingSection>
                <SettingSection
                    value="camouflage"
                    triggerText={t("page.hosts.camouflage-settings")}
                >
                    <FragmentField />
                    <NoiseField />
                </SettingSection>
                <SettingSection
                    value="mux"
                    triggerText={t("page.hosts.mux-settings")}
                >
                    <MuxSettingsFields />
                </SettingSection>
                <SettingSection
                    value="security"
                    triggerText={t("page.hosts.security-settings")}
                >
                    <SecurityFields />
                </SettingSection>
            </Accordion>
        </div>
    );
};

export * from "./schema";
export * from "./split-http-settings.schema";
export * from "./default";
