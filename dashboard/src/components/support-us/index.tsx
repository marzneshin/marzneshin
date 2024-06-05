import { X, HeartHandshake } from "lucide-react";
import { Button, Card, CardTitle, CardContent, PopoverTrigger, Popover, PopoverContent } from "@marzneshin/components";
import { type FC, type HTMLAttributes } from "react";
import { cn } from "@marzneshin/utils";
import { useTranslation } from "react-i18next";
import { SupportUsVariation, SupportUsStructure } from "./types";
import { useSupportUs } from "./use-support-us";

export interface SupportUsProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    variant?: SupportUsVariation;
    structure?: SupportUsStructure;
}

export const SupportUs: FC<SupportUsProps> = ({ open = true, variant = "status", className, structure = "card" }) => {
    const [supportUsOpen, setSupportUsOpen] = useSupportUs(variant, open);
    const { t } = useTranslation();

    const CardStructure = () => (
        <Card>
            <CardContent className={cn("p-4 flex flex-col w-fit gap-2 text-muted-foreground text-sm", className)}>
                <CardTitle className="flex-row flex items-center justify-between w-full text-primary">
                    <div className="text-medium flex-row flex gap-1">
                        <HeartHandshake /> {t('support-us.title')}
                    </div>
                    {variant !== "view" && (
                        <Button
                            variant="ghost"
                            className="size-6 p-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
                            onMouseDown={() => setSupportUsOpen(false)}
                        >
                            <X className="size-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    )}
                </CardTitle>
                <p>{t('support-us.desc')}</p>
                <Button size="sm" variant="secondary" className="w-fit" asChild>
                    <a
                        href="https://github.com/khodedawsh/marzneshin#donation"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('support-us.donate')}
                    </a>
                </Button>
            </CardContent>
        </Card>
    );

    const PopoverStructure = () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" variant="secondary">
                    <HeartHandshake />
                </Button>
            </PopoverTrigger>
            <PopoverContent sideOffset={10} className={cn("p-4 flex flex-col w-80 gap-2 text-muted-foreground text-sm", className)}>
                <div className="flex-row flex items-center justify-between w-full text-primary">
                    <div className="text-medium flex-row flex gap-1">
                        <HeartHandshake /> {t('support-us.title')}
                    </div>
                </div>
                <p>{t('support-us.desc')}</p>
                <Button size="sm" variant="secondary" className="w-fit" asChild>
                    <a
                        href="https://github.com/khodedawsh/marzneshin#donation"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t('support-us.donate')}
                    </a>
                </Button>
            </PopoverContent>
        </Popover>
    );

    if (!supportUsOpen) return null;
    return structure === "popover" ? <PopoverStructure /> : <CardStructure />;
};
