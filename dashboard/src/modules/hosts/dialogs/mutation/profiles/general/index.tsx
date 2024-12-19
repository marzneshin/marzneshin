import {
    CommonFields,
    FragmentField,
    HostField,
    MuxField,
    PathField,
    SecurityFields,
    SplitHttpField,
} from "../../fields";
import {Accordion, HStack} from "@marzneshin/common/components";
import {SettingSection} from "@marzneshin/modules/hosts"
import {useTranslation} from "react-i18next";
import {EarlyDataField} from "@marzneshin/modules/hosts/dialogs/mutation/fields/early_data.tsx";

export const GeneralProfileFields = () => {
    const {t} = useTranslation();
    return (
        <div className="space-y-2">
            <CommonFields/>
            <Accordion className="space-y-2" type="single" collapsible>
                <SettingSection value="network" triggerText={t("page.hosts.network-settings")}>
                    <HStack>
                        <HostField/>
                        <PathField/>
                    </HStack>
                    <EarlyDataField/>
                    <SplitHttpField/>
                </SettingSection>
                <SettingSection value="camouflage" triggerText={t("page.hosts.camouflage-settings")}>
                    <FragmentField/>
                    <MuxField/>
                </SettingSection>
                <SettingSection value="security" triggerText={t("page.hosts.security-settings")}>
                    <SecurityFields/>
                </SettingSection>
            </Accordion>
        </div>
    )
}

export * from "./schema";
export * from "./default";
