import {
    CommonFields,
    HostField,
    MuxField,
    FragmentField,
    PathField,
    WeightField,
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
        <>
            <CommonFields />
            <Accordion type="single" collapsible>
                <SettingSection value="advanced" triggerText={t("advanced-options")}>
                    <HStack>
                        <HostField />
                        <PathField />
                        <WeightField />
                    </HStack>
                    <FragmentField />
                    <MuxField />
                    <SecurityFields />
                </SettingSection>
            </Accordion>
        </>
    )
}

export * from "./schema";
export * from "./default";
