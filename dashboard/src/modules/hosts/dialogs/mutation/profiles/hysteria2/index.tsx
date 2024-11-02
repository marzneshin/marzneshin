import {
    CommonFields,
    PathField,
} from "../../fields";
import {
    TlsFields
} from "../../sections";
import {
    Accordion,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";

export const Hysteria2ProfileFields = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <CommonFields />
            <PathField label={t("page.hosts.obfuscation-password")} />
            <Accordion className="space-y-2" type="single" collapsible>
                <TlsFields />
            </Accordion>
        </div>
    )
}

export * from "./schema";
export * from "./default";
