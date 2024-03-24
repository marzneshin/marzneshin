import { Sidebar, SidebarItem } from "@marzneshin/components";
import { useRouterState } from "@tanstack/react-router";
import { FC, useEffect } from "react";
import { sidebarItems } from ".";


interface DashboardSidebarProps {
    collapsed: boolean;
    setCollapsed: (state: boolean) => void;
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({ collapsed, setCollapsed }) => {
    const router = useRouterState();
    const currentActivePath = router.location.pathname;

    useEffect(() => { }, [collapsed]);

    return (
        <aside>
            <nav className="w-full">
                <Sidebar
                    sidebar={sidebarItems}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                >
                    <div className="flex flex-col p-4 w-full h-full">
                        <Sidebar.Body className="my-3">
                            {Object.keys(sidebarItems).map((key) =>
                            (
                                <div className="my-2 w-full" key={key}>
                                    <Sidebar.Group>{key}</Sidebar.Group>
                                    {sidebarItems[key].map((item: SidebarItem, i) => (
                                        <Sidebar.Item
                                            variant={currentActivePath === item.to ? "active" : "default"}
                                            className="my-2 border-transparent"
                                            item={item}
                                            key={i}
                                        />
                                    )
                                    )}
                                </div>
                            )
                            )}
                        </Sidebar.Body>
                    </div>
                </Sidebar>
            </nav>
        </aside>
    )
}
