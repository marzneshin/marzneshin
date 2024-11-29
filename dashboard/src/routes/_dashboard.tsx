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
import { Suspense, useState, useEffect } from "react";
import {
    Outlet,
    Link,
    createFileRoute,
    redirect
} from "@tanstack/react-router";
import { useGithubRepoStatsQuery, GithubRepo } from "@marzneshin/features/github-repo";
import { CommandBox } from "@marzneshin/features/search-command";
import { DashboardBottomMenu } from "@marzneshin/features/bottom-menu";
import { VersionIndicator } from "@marzneshin/features/version-indicator";

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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, [collapsed]);

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
                                onToggle={() => {
                                    toggleCollapse();
                                    setIsLoading(true);
                                }}
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
                        <ResizablePanel className="flex-col flex justify-between">
                            <main className="flex flex-col h-full">
                                <Suspense fallback={<Loading />}>
                                    <Outlet />
                                </Suspense>
                            </main>
                            <footer className="h-10 py-2">
                                <VersionIndicator />
                            </footer>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                ) : (
                    <div className="flex flex-col h-full w-full">
                        <main className="flex flex-col h-full overflow-y-auto">
                            <Suspense fallback={<Loading />}>
                                <Outlet />
                            </Suspense>
                            <footer className="h-30 border-t-3 py-2 px-5">
                                <DashboardBottomMenu variant={isSudo() ? "sudo-admin" : "admin"} />
                            </footer>
                        </main>
                    </div>
                )}
            </div>
            {isLoading && <Loading />}
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
