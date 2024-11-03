import {
    Button,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@marzneshin/common/components";
import CopyToClipboard from "react-copy-to-clipboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CopyCheck, CopyX, ClipboardCopy, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@marzneshin/common/utils";

interface CopyToClipboardButtonProps {
    text: string;
    disabled?: boolean;
    successMessage: string;
    copyIcon?: LucideIcon;
    copyLabel?: string;
    errorLabel?: string;
    className?: string;
    tooltipMsg?: string;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
    text,
    disabled = false,
    successMessage,
    copyIcon,
    copyLabel,
    errorLabel,
    className,
    tooltipMsg,
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
        setHealthy(text !== "");
    }, [text]);

    const handleClick = () => {
        if (!disabled) {
            setCopied(true);
        }
    };

    const tooltip = tooltipMsg ? tooltipMsg : copyLabel ? copyLabel : undefined;

    const Icon = copied ? CopyCheck : healthy ? copyIcon || ClipboardCopy : CopyX;
    const isWithLabel = successMessage && copyLabel && errorLabel;

    return (
        <Tooltip>
            <CopyToClipboard text={text}>
                <TooltipTrigger asChild>
                    <Button
                        className={cn(className, "p-2 flex flex-row items-center gap-2")}
                        disabled={disabled || !healthy}
                        onClick={handleClick}
                    >
                        <Icon />
                        {isWithLabel &&
                            t(copied ? successMessage : healthy ? copyLabel : errorLabel)}
                    </Button>
                </TooltipTrigger>
            </CopyToClipboard>
            {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
        </Tooltip>
    );
};
