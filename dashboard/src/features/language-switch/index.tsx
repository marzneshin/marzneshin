import {
    Button,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuItem,
    DropdownMenuSubTrigger,
    DropdownMenuPortal
} from "@marzneshin/components";
import { Languages } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitchMenu: FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger arrowDir="left">
                <div className="hstack items-center justify-end">
                    <span className="mx-1">Language</span>
                    <Languages className="size-[1rem]" />
                </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
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
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
};
