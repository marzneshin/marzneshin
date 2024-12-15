import { Box } from "lucide-react";
import { type FC } from 'react';
import {
    Badge,
    Label,
} from "@marzneshin/common/components";
import {
    type InboundType
} from '@marzneshin/modules/inbounds';

export const InboundCardHeader: FC<{ entity: InboundType }> = ({ entity }) => {
    return (
        <div className="flex items-center">
            <Label className="font-bold capitalize">{entity.tag}</Label>
        </div>
    )
}

export const InboundCardContent: FC<{ entity: InboundType }> = ({ entity }) => {
    return (
        <div className="flex justify-between">
            <div className="hstack items-center">
                <Box className="p-1" /> {entity.node.name}
            </div>
            <Badge>
                {entity.protocol}
            </Badge>

        </div>
    )
}
