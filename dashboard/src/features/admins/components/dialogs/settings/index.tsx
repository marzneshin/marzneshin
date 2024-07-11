import {
    // Button,
    ScrollArea,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Awaiting,
} from "@marzneshin/components";
import {
    type AdminType
} from "@marzneshin/features/admins";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    AdminInfoTable
} from "./admin-info";
import { AdminInfoSkeleton } from "./skeleton";

interface AdminsSettingsDialogProps {
    onOpenChange: (state: boolean) => void;
    open: boolean;
    entity: AdminType | null;
    onClose: () => void;
    isPending: boolean;
}

export const AdminsSettingsDialog: FC<AdminsSettingsDialogProps> = ({
    onOpenChange,
    open,
    entity,
    onClose,
    isPending,
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:min-w-full md:min-w-[700px] space-y-5">
                <SheetHeader >
                    <SheetTitle>{t("settings")}</SheetTitle>
                </SheetHeader>
                <Awaiting
                    Component={entity ? (
                        <ScrollArea className="flex flex-col gap-4 h-full">
                            <Tabs defaultValue="info" className="w-full h-full">
                                <TabsList className="w-full bg-accent">
                                    <TabsTrigger className="w-full" value="info">
                                        {t("admin_info")}
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="services">
                                        {t("services")}
                                    </TabsTrigger>
                                    <TabsTrigger className="w-full" value="subscription">
                                        {t("users")}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="info"
                                    className="flex flex-col gap-2 w-full h-full"
                                >
                                    <AdminInfoTable admin={entity} />
                                </TabsContent>
                                <TabsContent value="services">
                                    {/* <AdminServicesTable admin={entity} /> */}
                                    Services
                                </TabsContent>
                                <TabsContent value="users">
                                    Users
                                </TabsContent>
                            </Tabs>
                        </ScrollArea>
                    ) : (<div>Not Found</div>)}
                    Skeleton={<AdminInfoSkeleton />}
                    isFetching={isPending}
                />
            </SheetContent>
        </Sheet>
    );
};
