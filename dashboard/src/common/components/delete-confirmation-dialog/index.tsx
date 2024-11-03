import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@marzneshin/common/components";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationProps {
    action: () => void;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}

export const DeleteConfirmation: FC<DeleteConfirmationProps> = ({
    action,
    open,
    onOpenChange,
}) => {
    const { t } = useTranslation();
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex flex-row gap-3 items-center text-destructive">
                        <ExclamationTriangleIcon className="p-2 w-10 h-10 bg-red-200 rounded-md border-2 border-destructive" />
                        {t("delete-confirmation.title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("delete-confirmation.desc")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={action} className="bg-destructive">
                        {t("delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
