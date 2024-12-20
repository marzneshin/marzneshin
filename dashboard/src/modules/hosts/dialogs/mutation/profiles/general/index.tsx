import {
    CommonFields,
    FragmentField,
    HostField,
    MuxField,
    PathField,
    SecurityFields,
    SplitHttpFields,
    EarlyDataField,
} from "../../fields";
import { Accordion, HStack } from "@marzneshin/common/components";
import { SettingSection } from "@marzneshin/modules/hosts"
import { useTranslation } from "react-i18next";
import { NoiseField } from "../../fields/noise";

export const GeneralProfileFields = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <CommonFields />
            <Accordion className="space-y-2" type="single" collapsible>
                <SettingSection value="network" triggerText={t("page.hosts.network-settings")}>
                    <HStack>
                        <HostField />
                        <PathField />
                    </HStack>
                </SettingSection>
                <SettingSection
                    variant='toggle'
                    value="split-http"
                    triggerText={t("page.hosts.split-http-settings")}
                >
                    <SplitHttpFields />
                    <EarlyDataField />
                </SettingSection>
                <SettingSection value="camouflage" triggerText={t("page.hosts.camouflage-settings")}>
                    <FragmentField />
                    <NoiseField />
                    <MuxField />
                </SettingSection>
                <SettingSection value="security" triggerText={t("page.hosts.security-settings")}>
                    <SecurityFields />
                </SettingSection>
            </Accordion>
        </div>
    )
}

export * from "./schema";
export * from "./split-http-settings.schema";
export * from "./default";
