import {
    CommonFields,
    PathField,
} from "../../fields";
import {
    TlsFields
} from "../../sections";
import {
    Accordion,
    HStack
} from "@marzneshin/components";
import { SettingSection } from "@marzneshin/modules/hosts"

export const Hysteria2ProfileFields = () => {
    return (
        <>
            <CommonFields />
            <Accordion type="single" collapsible>
                <SettingSection value="hysteria2" triggerText="Hysteria2">
                    <HStack>
                        <PathField />
                    </HStack>
                    <TlsFields />
                </SettingSection>
            </Accordion>
        </>
    )
}

export * from "./schema";
