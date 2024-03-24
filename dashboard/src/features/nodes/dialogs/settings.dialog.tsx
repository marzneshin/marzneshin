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
import { NodeType } from ".."
// import { useNodesSettingsQuery } from "../services/settings.query";
import { LogContainer } from "../log";
import { NodesDetailTable } from "../tables/detail-table";

interface NodesSettingsDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    node: NodeType | null
}

export const NodesSettingsDialog: FC<NodesSettingsDialogProps> = ({ onOpenChange, open, node }) => {

    const { t } = useTranslation();
    // const { data: config } = useNodesSettingsQuery(node);

    if (node) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:min-w-full md:min-w-[600px]" >
                    <SheetHeader>
                        <SheetTitle>
                            {t('page.nodes.settings.title')}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="my-4">
                        <h1 className="font-medium font-header">{t('page.nodes.settings.detail')}</h1>
                        <NodesDetailTable node={node} />
                    </div>
                    <Tabs className="my-3 w-full h-full" defaultValue="logs">
                        <TabsList className="w-full">
                            <TabsTrigger className="w-full" value="logs">{t('logs')}</TabsTrigger>
                            <TabsTrigger className="w-full" value="config">{t('config')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="logs" className="h-full">
                            <LogContainer node={node} />
                        </TabsContent>
                        <TabsContent value="config">
                            Config
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        )
    }
}
