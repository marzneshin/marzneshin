
import { Button } from '@marzneshin/components'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useCertificateQuery } from '../services';
import { ClipboardCopy, CopyCheck, CopyX, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ICopyAt<T> {
    copied: T
    copy: T
    noCopy: T
    healthyState: boolean
    copiedState: boolean
}

function copyAt<T>(
    { copied, copy, noCopy, healthyState, copiedState }: ICopyAt<T>
): T {
    if (healthyState) {
        return copiedState ? copied : copy
    }
    else {
        return noCopy
    }
}

export const CertificateButton = () => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState([-1, false]);
    const [healthy, setHealthy] = useState<boolean>(false);
    const [Icon, setIcon] = useState<LucideIcon>(ClipboardCopy);
    const [title, setTitle] = useState<string>('page.settings.certificate.copy');
    const { data: certificate } = useCertificateQuery()

    useEffect(() => {
        if (copied[1]) {
            toast.success(t('page.settings.certificate.copied'));
            setTimeout(() => {
                setCopied([-1, false]);
            }, 1000);
        }
    }, [copied, t]);

    useEffect(() => {
        setHealthy(certificate !== '')
    }, [certificate])

    useEffect(() => {
        setIcon(copyAt({
            copied: CopyCheck,
            copy: ClipboardCopy,
            noCopy: CopyX,
            healthyState: healthy,
            copiedState: copied[1] as boolean
        }))

        setTitle(copyAt({
            copied: 'page.settings.certificate.copied',
            copy: 'page.settings.certificate.copy',
            noCopy: 'page.settings.certificate.error',
            healthyState: healthy,
            copiedState: copied[1] as boolean
        }));
    }, [copied, healthy]);


    return (
        <CopyToClipboard text={certificate}>
            <Button className="p-2" disabled={!healthy} onClick={() => setCopied([0, true])}>
                <Icon />
                {t(title)}
            </Button>
        </CopyToClipboard>
    )
}
