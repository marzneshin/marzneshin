import {
    MiniWidget
} from "@marzneshin/common/components";
import {
    CertificateButton
} from "@marzneshin/modules/settings";
import { useTranslation } from "react-i18next";

export const CertificateWidget = () => {
    const { t } = useTranslation()
    return (
        <MiniWidget
            title={t("certificate")}
        >
            <CertificateButton />
        </MiniWidget>
    )
}
