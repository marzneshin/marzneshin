import {
    CommonFields,
    HostField,
    MuxField,
    FragmentField,
    PathField,
    SecurityFields,
} from "../../fields";
import {
    Accordion,
    HStack
} from "@marzneshin/components";
import { SettingSection } from "@marzneshin/modules/hosts"
import { useTranslation } from "react-i18next";

export const GeneralProfileFields = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <CommonFields />
            <Accordion type="single" collapsible>
                <SettingSection value="advanced" triggerText={t("advanced-options")}>
                    <HStack>
                        <HostField />
                        <PathField />
                    </HStack>
                    <FragmentField />
                    <MuxField />
                    <SecurityFields />
                </SettingSection>
            </Accordion>
        </div>
    )
}

export * from "./schema";
export * from "./default";
