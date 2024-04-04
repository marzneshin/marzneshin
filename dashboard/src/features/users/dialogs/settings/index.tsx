import {
    ScrollArea,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@marzneshin/components"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { UserServicesTable, UserType } from "@marzneshin/features/users"
import { UserInfoTable, QRCodeSection } from "./user-info"

interface UsersSettingsDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: UserType | null
}

export const UsersSettingsDialog: FC<UsersSettingsDialogProps> = ({ onOpenChange, open, entity }) => {

    const { t } = useTranslation();

    if (entity) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:min-w-full md:min-w-[700px]" >
                    <SheetHeader>
                        <SheetTitle>
                            {t('settings')}
                        </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex flex-col gap-4 m-3 h-full">
                        <Tabs defaultValue="info" className="w-full h-full">
                            <TabsList className="w-full bg-accent">
                                <TabsTrigger className="w-full" value="info"> {t('user_info')} </TabsTrigger>
                                <TabsTrigger className="w-full" value="services"> {t('services')} </TabsTrigger>
                            </TabsList>
                            <TabsContent value="info" className="flex flex-col gap-4">
                                <UserInfoTable entity={entity} />
                                <QRCodeSection entity={entity} />
                            </TabsContent>
                            <TabsContent value="services">
                                <UserServicesTable user={entity} />
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        )
    }
}
