
import { Badge, Label } from '@marzneshin/components'
import { InboundType } from '@marzneshin/features/inbounds'
import { Box } from 'lucide-react'
import { FC } from 'react'

interface InboundOptionProps {
    inbound: InboundType
}

export const InboundOption: FC<InboundOptionProps> = ({ inbound }) => {
    return (
        <div className="p-2 mx-0 w-full rounded-md border">
            <div className="flex justify-between">
                <Label className="font-bold capitalize">{inbound.tag}</Label>
                <Badge>
                    {inbound.protocol}
                </Badge>
            </div>

            <div className="flex items-center">
                <Box className="p-1" /> {inbound.node.name}
            </div>
        </div>
    )
}
