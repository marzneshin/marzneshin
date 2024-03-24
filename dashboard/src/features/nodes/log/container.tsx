import { Badge, Card, CardContent, CardHeader, ScrollArea } from "@marzneshin/components"
import { NodeType, NodesStatus, NodesStatusBadge, useNodesLog } from ".."
import { FC } from "react"

interface LogContainerProps {
    node: NodeType
}

export const LogContainer: FC<LogContainerProps> = ({ node }) => {
    const { logs, status, logsDiv } = useNodesLog(node)
    console.log(logs.length)
    return (
        <Card className="h-1/2">
            <CardContent className="flex flex-col p-1 h-full" >
                <CardHeader className="flex flex-row justify-between items-center p-2">
                    <p className="font-header">Marznode status logs</p>
                    <div className="flex flex-row gap-2 justify-center items-center">
                        <NodesStatusBadge status={NodesStatus[node.status]} />
                        <Badge className="flex justify-center items-center w-full h-6 capitalize">
                            {status}
                        </Badge>

                    </div>
                </CardHeader>
                <ScrollArea className="flex p-2 m-1 h-full rounded-b-md divide-dashed divide-accent bg-secondary text-primary" ref={logsDiv}>
                    {logs.map((log: string) => {
                        return <p className="font-mono text-[0.7rem] text-primary">{log}</p>
                    })}
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
