import { Sidebar, SidebarItem } from "@marzneshin/components";
import { useRouterState } from "@tanstack/react-router";
import { FC, useEffect } from "react";
import { sidebarItems as sidebar } from ".";


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
                    sidebar={sidebar}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                >
                    <div className="flex flex-col p-4 w-full h-full">
                        <Sidebar.Body>

                            {Object.keys(sidebar).map((key) =>
                            (
                                <div className="my-2 w-full" key={key}>
                                    <Sidebar.Group>{key}</Sidebar.Group>
                                    {sidebar[key].map((item: SidebarItem, i) => (
                                        <Sidebar.Item
                                            variant={currentActivePath === item.to ? "active" : "default"}
                                            className="my-2"
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
