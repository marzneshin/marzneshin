import { FC } from 'react';
import { Badge, Label } from '@marzneshin/common/components';
import { StatusType } from '@marzneshin/common/types';
import { NodesStatus } from '..';

interface NodesStatusBadgeProps {
    status: StatusType;
}

export const NodesStatusBadge: FC<NodesStatusBadgeProps> = ({ status }) => {
    const { label, icon: Icon } = status;

    let badgeVariant: 'outline' | 'destructive' | undefined | null;
    switch (label) {
        case NodesStatus.healthy.label:
            badgeVariant = undefined;
            break;
        case NodesStatus.unhealthy.label:
            badgeVariant = "destructive";
            break;
        case NodesStatus.disabled.label:
            badgeVariant = "outline";
            break;
        case "none":
            return null;
    }

    return (
        <Badge variant={badgeVariant} className="h-6">
            {Icon && <Icon className="mr-1 w-5 h-4" />} <Label className="capitalize">{label}</Label>
        </Badge>
    );
};

export default NodesStatusBadge;
