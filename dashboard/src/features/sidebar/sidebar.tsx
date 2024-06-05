import {
    Sidebar,
    type SidebarItem,
    SupportUs,
    Popover,
    PopoverContent,
    Button,
    PopoverTrigger
} from "@marzneshin/components";
import { useRouterState } from "@tanstack/react-router";
import type { FC } from "react";
import { sidebarItems } from ".";
import { cn } from "@marzneshin/utils";
import { HeartHandshake } from "lucide-react";

interface DashboardSidebarProps {
    collapsed: boolean;
    setCollapsed: (state: boolean) => void;
    open?: boolean;
    setOpen?: (state: boolean) => void;
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({
    collapsed,
    setCollapsed,
    setOpen,
    open,
}) => {
    const router = useRouterState();
    const currentActivePath = router.location.pathname;

    return (
        <aside className="size-full py-4  px-4 ">
            <nav className="size-full">
                <Sidebar
                    sidebar={sidebarItems}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    open={open}
                    setOpen={setOpen}
                >
                    <div className="flex size-full flex-col justify-between">
                        <Sidebar.Body>
                            {Object.keys(sidebarItems).map((key) => (
                                <div className="w-full" key={key}>
                                    <Sidebar.Group>{key}</Sidebar.Group>
                                    {sidebarItems[key].map((item: SidebarItem) => (
                                        <Sidebar.Item
                                            variant={
                                                currentActivePath === item.to ? "active" : "default"
                                            }
                                            className={cn("my-2 border-transparent", {
                                                "w-10 h-10": collapsed,
                                            })}
                                            item={item}
                                            key={item.title}
                                        />
                                    ))}
                                </div>
                            ))}
                        </Sidebar.Body>
                        <Sidebar.Footer>
                            {collapsed ?
                                (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button size="icon" variant="secondary">
                                                <HeartHandshake />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80" asChild>
                                            <SupportUs variant="view" />
                                        </PopoverContent>
                                    </Popover>
                                )
                                :
                                <SupportUs variant="local-storage" />
                            }
                        </Sidebar.Footer>
                    </div>
                </Sidebar>
            </nav>
        </aside>
    );
};
