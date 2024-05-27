import { useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";

export const usePanelToggle = (isDesktop: boolean) => {
    const [collapsed, setCollapsed] = useState(false);
    const panelRef = useRef<ImperativePanelHandle>(null);
    const [open, setOpen] = useState(false);

    const toggleCollapse = () => {
        const panel = panelRef.current;
        if (isDesktop && panel) {
            collapsed ? panel.expand() : panel.collapse();
            setCollapsed(!collapsed);
            setOpen(false);
        }
    };

    const toggleOpen = () => {
        if (!isDesktop) {
            setCollapsed(false);
            setOpen(!open);
        }
    };

    return {
        collapsed,
        open,
        panelRef,
        setCollapsed,
        setOpen,
        toggleCollapse,
        toggleOpen,
    };
};
