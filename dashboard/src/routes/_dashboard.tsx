import {
    Header,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    Toaster,
    Loading,
    HeaderLogo,
    HeaderMenu,
} from "@marzneshin/common/components";
import { useAuth } from "@marzneshin/modules/auth";
import { DashboardSidebar, ToggleButton } from "@marzneshin/features/sidebar";
import { usePanelToggle } from "@marzneshin/features/sidebar/use-panel-toggle";
import { useScreenBreakpoint } from "@marzneshin/common/hooks/use-screen-breakpoint";
import { cn } from "@marzneshin/common/utils";
import { Suspense } from "react";
import {
    Outlet,
    Link,
    createFileRoute,
    redirect
} from "@tanstack/react-router";
import { useGithubRepoStatsQuery, GithubRepo } from "@marzneshin/features/github-repo";
import { CommandBox } from "@marzneshin/features/search-command";
import { DashboardBottomMenu } from "@marzneshin/features/bottom-menu";

export const DashboardLayout = () => {
    const isDesktop = useScreenBreakpoint("md");
    const {
        collapsed,
        panelRef,
        setCollapsed,
        toggleCollapse,
    } = usePanelToggle(isDesktop);
    const { isSudo } = useAuth();
    const { data: stats } = useGithubRepoStatsQuery()

    return (
        <div className="flex flex-col w-screen h-screen">
            <Header
                start={
                    <>
                        <Link to="/">
                            <HeaderLogo />
                        </Link>
                        {isDesktop && (

                            <ToggleButton
                                collapsed={collapsed}
                                onToggle={toggleCollapse}
                            />
                        )}
                    </>
                }
                center={<CommandBox />}
                end={
                    <>
                        <GithubRepo {...stats} variant={isDesktop ? "full" : "mini"} />
                        <HeaderMenu />
                    </>
                }
            />
            <div className="flex flex-1 overflow-hidden">
                {isDesktop ? (
                    <ResizablePanelGroup direction="horizontal" className="flex h-full w-full">
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
                        <ResizablePanel className="flex flex-col h-full">
                            <main className="flex-grow flex flex-col overflow-y-auto">
                                <Suspense fallback={<Loading />}>
                                    <Outlet />
                                </Suspense>
                            </main>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                ) : (
                    <div className="flex flex-col h-full w-full">
                        <main className="flex flex-col h-full overflow-y-auto">
                            <Suspense fallback={<Loading />}>
                                <Outlet />
                            </Suspense>
                            <footer className="h-30 border-t-3 shrink-0 py-2 px-5">
                                <DashboardBottomMenu variant={isSudo() ? "sudo-admin" : "admin"} />
                            </footer>
                        </main>
                    </div>
                )}
            </div>
            <Toaster position="top-center" />
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
