import { useTranslation } from 'react-i18next';
import { useCertificateQuery } from '../services';
import { CopyToClipboardButton } from '@marzneshin/components';
import { ClipboardCopy } from 'lucide-react';

export const CertificateButton = () => {
    const { t } = useTranslation();
    const { data: certificate } = useCertificateQuery();

    return (
        <CopyToClipboardButton
            text={certificate}
            successMessage={t('page.settings.certificate.copied')}
            copyIcon={ClipboardCopy}
            copyLabel={t('page.settings.certificate.copy')}
            errorLabel={t('page.settings.certificate.error')}
        />
    );
};
