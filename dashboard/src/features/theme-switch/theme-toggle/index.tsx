import { Moon, Sun } from "lucide-react";
import {
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuItem,
    DropdownMenuPortal,
} from "@marzneshin/components";
import { useTheme } from "../theme-provider";
import { useTranslation } from "react-i18next";
import { cn } from "@marzneshin/utils";

const ThemeItem = ({ schema }: { schema: string }) => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    return (
        <DropdownMenuItem
            className={cn({ "bg-primary text-secondary": theme === schema })}
            onMouseDown={() => setTheme("light")}>
            {t(schema)}
        </DropdownMenuItem>
    );
}

export function ThemeToggle() {
    const { t } = useTranslation();

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger arrowDir="left" className="w-full flex">
                <div className="flex items-center ml-auto">
                    <Sun className="w-4 h-4 m-0 transition-all transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
                    <Moon className="w-4 h-4 m-0 transition-all transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
                </div>
                <span>{t('theme')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="space-y-1">
                    <ThemeItem schema="light" />
                    <ThemeItem schema="dark" />
                    <ThemeItem schema="system" />
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );

}
