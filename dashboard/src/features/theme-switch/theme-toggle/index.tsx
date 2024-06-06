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

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const { t } = useTranslation();

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger arrowDir="left" className="w-full flex">
                <div className="flex items-center ml-auto">
                    <Sun className="w-4 h-4 m-0 transition-all transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
                    <Moon className="w-4 h-4 m-0 transition-all transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
                </div>
                <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        {t("light")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        {t("dark")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        {t("system")}
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
}
