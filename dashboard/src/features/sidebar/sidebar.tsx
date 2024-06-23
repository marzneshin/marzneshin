import {
    Sidebar,
    type SidebarItem,
} from "@marzneshin/components";
import { useIsCurrentRoute } from "@marzneshin/hooks";
import type { FC } from "react";
import { sidebarItems as sidebarItemsSudoAdmin, sidebarItemsNonSudoAdmin } from ".";
import { cn } from "@marzneshin/utils";
import { useAuth } from "@marzneshin/features/auth";
import {
    SupportUs,
} from "@marzneshin/features/support-us";
import { VersionIndicator } from "@marzneshin/features/version-indicator";

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
    const { isSudo } = useAuth();
    const { isCurrentRouteActive } = useIsCurrentRoute()
    const sidebarItems = isSudo() ? sidebarItemsSudoAdmin : sidebarItemsNonSudoAdmin
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
                                            variant={isCurrentRouteActive(item.to) ? "active" : "default"}
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
                                <SupportUs variant="view" structure="popover" />
                                :
                                <SupportUs variant="local-storage" structure="card" />
                            }
                            <VersionIndicator />
                        </Sidebar.Footer>
                    </div>
                </Sidebar>
            </nav>
        </aside>
    );
};
