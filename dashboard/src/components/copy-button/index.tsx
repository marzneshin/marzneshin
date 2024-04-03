import { Button } from '@marzneshin/components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyCheck, CopyX, ClipboardCopy, LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CopyToClipboardButtonProps {
    text: string;
    disabled?: boolean;
    successMessage: string;
    copyIcon?: LucideIcon;
    copyLabel: string;
    errorLabel: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
    text,
    disabled = false,
    successMessage,
    copyIcon,
    copyLabel,
    errorLabel
}) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [healthy, setHealthy] = useState(false);

    useEffect(() => {
        if (copied) {
            toast.success(t(successMessage));
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied, successMessage, t]);

    useEffect(() => {
        setHealthy(text !== '');
    }, [text]);

    const handleClick = () => {
        if (!disabled) {
            setCopied(true);
        }
    };

    const Icon = copied ? CopyCheck : (healthy ? (copyIcon ? copyIcon : ClipboardCopy) : CopyX)

    return (
        <CopyToClipboard text={text}>
            <Button className="p-2" disabled={disabled || !healthy} onClick={handleClick}>
                <Icon />
                {t(copied ? successMessage : (healthy ? copyLabel : errorLabel))}
            </Button>
        </CopyToClipboard>
    );
};
