import {
    AllowedIpsField,
    CommonFields,
    DNSServersField,
    MtuField,
} from "../../fields";
import {
    Accordion,
    ClearableTextField,
    HStack,
} from "@marzneshin/common/components";
import { SettingSection } from "@marzneshin/modules/hosts";
import { useTranslation } from "react-i18next";

export const WireguardProfileFields = () => {
    const { t } = useTranslation();
    return (
        <>
            <CommonFields />
            <Accordion type="single" collapsible>
                <SettingSection value="wireguard" triggerText={t("wireguard")}>
                    <HStack>
                        <ClearableTextField
                            name="path"
                            label={t("page.hosts.server-public-key")}
                        />
                        <MtuField />
                    </HStack>
                    <DNSServersField />
                    <AllowedIpsField />
                </SettingSection>
            </Accordion>
        </>
    );
};

export * from "./schema";
export * from "./default";
