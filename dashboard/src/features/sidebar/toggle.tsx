
import { Button } from '@marzneshin/common/components';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { FC } from 'react';

interface ToggleButtonProps {
    collapsed: boolean;
    onToggle: () => void;
}

export const ToggleButton: FC<ToggleButtonProps> = ({ collapsed, onToggle }) => {
    const Icon = (collapsed ? PanelRightClose : PanelRightOpen);

    return (
        <Button className="p-2 bg-secondary-foreground border-2 text-primary-foreground dark:bg-secondary dark:text-primary" onClick={onToggle}>
            <Icon className="w-full h-full" />
        </Button>
    );
};
