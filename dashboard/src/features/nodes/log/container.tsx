import { Badge, Card, CardContent, CardHeader, ScrollArea } from "@marzneshin/components"
import { NodeType, useNodesLog } from ".."
import { FC } from "react"
import { useTranslation } from "react-i18next"

interface LogContainerProps {
    node: NodeType
}

export const LogContainer: FC<LogContainerProps> = ({ node }) => {
    const { logs, status, logsDiv } = useNodesLog(node)
    const { t } = useTranslation()
    return (
        <Card className="h-1/2">
            <CardContent className="flex flex-col p-1 h-full" >
                <CardHeader className="flex flex-row justify-between items-center p-2">
                    <p className="capitalize font-header">{t('page.nodes.settings.log-container.title')}</p>
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <Badge variant={status === "closed" ? "destructive" : "default"} className="flex justify-center items-center w-full h-6 capitalize">
                            {status}
                        </Badge>
                    </div>
                </CardHeader>
                <ScrollArea className="flex p-2 m-1 h-full rounded-b-md divide-dashed divide-accent bg-secondary text-primary" ref={logsDiv}>
                    {logs.map((log: string, i) => {
                        return <p key={i} className="font-mono text-[0.7rem] text-primary">{log}</p>
                    })}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
