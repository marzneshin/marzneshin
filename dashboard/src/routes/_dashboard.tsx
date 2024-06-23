import {
    Drawer,
    DrawerContent,
    Header,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    Toaster,
    Loading,
    HeaderLogo,
    HeaderMenu,
} from "@marzneshin/components";
import { useAuth } from "@marzneshin/features/auth";
import { DashboardSidebar, ToggleButton } from "@marzneshin/features/sidebar";
import { usePanelToggle } from "@marzneshin/features/sidebar/use-panel-toggle";
import { useScreenBreakpoint } from "@marzneshin/hooks/use-screen-breakpoint";
import { cn } from "@marzneshin/utils";
import { Suspense } from "react";
import {
    Outlet,
    Link,
    createFileRoute,
    redirect
} from "@tanstack/react-router";
import { GithubRepo } from "@marzneshin/features/github-repo";
import { CommandBox } from "@marzneshin/features/search-command";
import { DashboardFooter } from "@marzneshin/features/footer";


export const DashboardLayout = () => {
    const isDesktop = useScreenBreakpoint("md");
    const {
        collapsed,
        panelRef,
        setCollapsed,
        toggleCollapse,
    } = usePanelToggle(isDesktop);

    return (
        <div className="flex flex-col w-screen h-screen">
            <Header
                start={
                    <>
                        <Link to="/">
                            <HeaderLogo />
                        </Link>
                        {isDesktop &&
                            <ToggleButton
                                collapsed={collapsed}
                                onToggle={toggleCollapse}
                            />}
                    </>
                }
                center={
                    <CommandBox />
                }
                end={
                    <>
                        <GithubRepo variant={isDesktop ? "full" : "mini"} />
                        <HeaderMenu />
                    </>
                }
            />
            {isDesktop ? (
                <ResizablePanelGroup direction="horizontal" className="block sm:hidden">
                    <ResizablePanel
                        collapsible
                        collapsedSize={2}
                        onCollapse={() => setCollapsed(true)}
                        onExpand={() => setCollapsed(false)}
                        minSize={15}
                        className={cn("w-[120px] min-w-[70px]")}
                        defaultSize={20}
                        ref={panelRef}
                        maxSize={30}
                    >
                        <DashboardSidebar
                            collapsed={collapsed}
                            setCollapsed={setCollapsed}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle className="w-[2px]" />
                    <ResizablePanel>
                        <main className="flex flex-col items-center justify-center">
                            <Suspense fallback={<Loading />}>
                                <Outlet />
                                <DashboardFooter />
                            </Suspense>
                            <Toaster position="top-center" />
                        </main>
                    </ResizablePanel>
                </ResizablePanelGroup>
            ) : (
                <div>
                    <aside>
                        <Drawer open={open} onOpenChange={setOpen}>
                            <DrawerContent>
                                <DashboardSidebar
                                    collapsed={collapsed}
                                    setCollapsed={setCollapsed}
                                    setOpen={setOpen}
                                    open={open}
                                />
                            </DrawerContent>
                        </Drawer>
                    </aside>
                    <main className="sm:block">
                        <Suspense fallback={<Loading />}>
                            <Outlet />
                        </Suspense>
                        <Toaster position="top-center" />
                    </main>
                </div>
            )}
        </div>
    );
};

export const Route = createFileRoute("/_dashboard")({
    component: () => <DashboardLayout />,
    beforeLoad: async () => {
        const loggedIn = await useAuth.getState().isLoggedIn();
        if (!loggedIn) {
            throw redirect({
                to: "/login",
            });
        }
    },
});
