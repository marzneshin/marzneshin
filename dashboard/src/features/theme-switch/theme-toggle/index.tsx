import { Moon, Sun } from "lucide-react";
import {
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuItem,
    DropdownMenuPortal,
} from "@marzneshin/common/components";
import { useTheme, Theme } from "../theme-provider";
import { useTranslation } from "react-i18next";
import { cn } from "@marzneshin/common/utils";

const ThemeItem = ({ schema }: { schema: Theme }) => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    return (
        <DropdownMenuItem
            className={cn({ "bg-primary text-secondary": theme === schema })}
            onMouseDown={() => setTheme(schema)}>
            {t(schema)}
        </DropdownMenuItem>
    );
}

export function ThemeToggle() {
    const { t } = useTranslation();

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger arrowDir="left" className="w-full flex">
                <div className="hstack gap-2  items-center justify-end w-full">
                    <span>{t('theme')}</span>
                    <div className="flex items-center">
                        <Sun className="w-4 h-4 m-0 transition-all transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
                        <Moon className="w-4 h-4 m-0 transition-all transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
                    </div>
                </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent className="space-y-1">
                    <ThemeItem schema="system" />
                    <ThemeItem schema="light" />
                    <ThemeItem schema="dark" />
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );

}
