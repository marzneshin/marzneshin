import {
    Button,
    Card,
    CardContent,
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
import { FC, useState } from "react"
import { useTranslation } from "react-i18next"
import { NodeType, useNodesSettingsMutation } from ".."
import { useNodesSettingsQuery } from "../services/settings.query";
import { LogContainer } from "../log";
import { NodesDetailTable } from "../tables/detail-table";
import Editor from '@monaco-editor/react';
import { useTheme } from "@marzneshin/features/theme-switch";

interface NodesSettingsDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: NodeType
}

export const NodesSettingsDialog: FC<NodesSettingsDialogProps> = ({ onOpenChange, open, entity }) => {

    const { t } = useTranslation();
    const { data } = useNodesSettingsQuery(entity);
    const [config, setConfig] = useState<any>(data)
    const [payloadValidity, setPayloadValidity] = useState<boolean>(true)
    const mutate = useNodesSettingsMutation();
    const { theme } = useTheme()

    const handleEditorValidation = (markers: any[]) => {
        setPayloadValidity(!markers.length)
    }

    const handleConfigSave = () => {
        mutate.mutate({ node: entity, config })
    }

    const handleConfigChange = (newConfig: string | undefined) => {
        if (newConfig) {
            try {
                const parsedConfig = JSON.parse(newConfig);
                setConfig(parsedConfig);
            } catch (error) {
                throw null;
            }
        }
    };

    if (entity) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:min-w-full md:min-w-[600px] " >
                    <ScrollArea className="h-full">
                        <SheetHeader>
                            <SheetTitle>
                                {t('page.nodes.settings.title')}
                            </SheetTitle>
                        </SheetHeader>
                        <div className="my-4">
                            <h1 className="font-medium font-header">{t('page.nodes.settings.detail')}</h1>
                            <NodesDetailTable node={entity} />
                        </div>
                        <Tabs className="my-3 w-full h-full" defaultValue="logs">
                            <TabsList className="w-full">
                                <TabsTrigger className="w-full" value="logs">{t('logs')}</TabsTrigger>
                                <TabsTrigger className="w-full" value="config">{t('config')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value="logs" className="h-full">
                                <LogContainer node={entity} />
                            </TabsContent>
                            <TabsContent value="config" className="h-full z-51">
                                <Card>
                                    <CardContent className="p-2 h-1/2 flex flex-col gap-2">
                                        <Editor
                                            height="50vh"
                                            className="rounded-sm border"
                                            defaultLanguage="json"
                                            theme={theme === "dark" ? "vs-dark" : "github"}
                                            defaultValue={JSON.stringify(data, null, '\t')}
                                            onChange={handleConfigChange}
                                            onValidate={handleEditorValidation}

                                        />
                                        <Button
                                            className="w-full"
                                            variant={!payloadValidity ? "destructive" : "default"}
                                            onClick={handleConfigSave}
                                            disabled={!payloadValidity}
                                        >
                                            {t('save')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        )
    }
}
