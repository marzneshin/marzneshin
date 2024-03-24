
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
        <Button className="p-2 bg-secondary-foreground border-2 text-primary-foreground dark:bg-secondary dark:text-primary" onClick={onToggle}>
            <Icon className="w-full h-full" />
        </Button>
    );
};
