import { X, HeartHandshake } from "lucide-react";
import { Button, Card, CardTitle, CardContent } from "@marzneshin/components";
import { useState, type FC, type HTMLAttributes } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { cn } from "@marzneshin/utils";
import { useTranslation } from "react-i18next";

interface SupportUsProps extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    variant?: "status" | "local-storage" | "view";
}

export const SupportUs: FC<SupportUsProps> = ({ open = true, variant = "status", className }) => {
    const [supportUsOpen, setSupportUsOpen] = variant === "local-storage" ? useLocalStorage("marzneshin-support-us", open) : useState(open);
    const { t } = useTranslation()
    return supportUsOpen && (
        <Card>
            <CardContent className={cn("p-4 flex flex-col w-fit gap-2 text-muted-foreground text-sm", className)}>
                <CardTitle className="flex-row flex items-center justify-between w-full text-primary">
                    <div className="text-medium flex-row flex gap-1">
                        <HeartHandshake /> Support Us
                    </div>
                    {variant !== "view" &&
                        <Button
                            variant="ghost"
                            className="size-6 p-0 rounded-sm opacity-70 ring-offset-background transition-opacity  hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
                            onMouseDown={() => setSupportUsOpen(false)}
                        >
                            <X className="size-4" />
                            <span className="sr-only">Close</span>
                        </Button>}
                </CardTitle>
                {t('support-us.desc')}
                <Button size="sm" variant="secondary" className="w-fit" asChild>
                    <a href="https://github.com/khodedawsh/marzneshin#donation">{t('support-us.donate')}</a>
                </Button>
            </CardContent>
        </Card>
    )
}
