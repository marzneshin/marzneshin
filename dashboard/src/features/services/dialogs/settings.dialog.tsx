import {
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
import { ServiceType } from "..";
import { ServiceInboundsTable } from "../tables/inbounds";
import { ServicesUsersTable } from "../tables/users";

interface ServicecSettingsDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: ServiceType
    onClose: () => void;
}

export const ServiceSettingsDialog: FC<ServicecSettingsDialogProps> = ({ onOpenChange, open, entity }) => {
    const { t } = useTranslation();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:min-w-full md:min-w-[700px]" >
                <SheetHeader>
                    <SheetTitle>
                        {t('page.services.settings.title')}
                    </SheetTitle>
                </SheetHeader>
                <Tabs className="my-3 w-full h-full" defaultValue="inbounds">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="inbounds">{t('inbounds')}</TabsTrigger>
                        <TabsTrigger className="w-full" value="users">{t('users')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="inbounds" className="h-full">
                        <ServiceInboundsTable service={entity} />
                    </TabsContent>
                    <TabsContent value="users" className="h-full">
                        <ServicesUsersTable service={entity} />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
