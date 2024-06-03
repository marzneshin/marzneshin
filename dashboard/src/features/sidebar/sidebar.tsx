import { Sidebar, type SidebarItem } from "@marzneshin/components";
import { useRouterState } from "@tanstack/react-router";
import type { FC } from "react";
import { sidebarItems } from ".";
import { cn } from "@marzneshin/utils";

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
    <aside>
      <nav className="w-full">
        <Sidebar
          sidebar={sidebarItems}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          open={open}
          setOpen={setOpen}
        >
          <div className="flex flex-col px-4 w-full h-full">
            <Sidebar.Body className="my-3">
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
          </div>
        </Sidebar>
      </nav>
    </aside>
  );
};
