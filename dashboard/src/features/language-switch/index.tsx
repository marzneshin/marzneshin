import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@marzneshin/components";
import { Languages } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitch: FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-gray-800 text-secondary dark:hover:bg-secondary-foreground dark:hover:text-secondary dark:text-secondary-foreground"
                    size="icon"
                >
                    <Languages className="h-[1rem] w-[1rem]" />
                    <span className="sr-only">Toggle Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("kmr")}>
                    Kurdî Kurmancî
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("kur")}>
                    Kurdî Soranî
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("ckb")}>
                    کوردی سورانی
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("fa")}>
                    فارسی
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("ru")}>
                    Русский
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
