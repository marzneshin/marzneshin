
import { Button } from '@marzneshin/components';
import { PanelBottomClose, PanelBottomOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { FC } from 'react';

interface ToggleButtonProps {
    isDesktop: boolean;
    collapsed: boolean;
    open: boolean;
    onToggle: () => void;
}

export const ToggleButton: FC<ToggleButtonProps> = ({ isDesktop, collapsed, open, onToggle }) => {
    const Icon = isDesktop ?
        (collapsed ? PanelRightClose : PanelRightOpen) :
        (open ? PanelBottomClose : PanelBottomOpen);

    return (
        <Button className="p-2 bg-muted-foreground text-primary-foreground" onClick={onToggle}>
            <Icon className="w-full h-full" />
        </Button>
    );
};
