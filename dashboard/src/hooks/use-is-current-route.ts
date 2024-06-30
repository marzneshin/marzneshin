import { useRouterState } from "@tanstack/react-router";

export const useIsCurrentRoute = () => {
    const router = useRouterState();
    const currentActivePath = router.location.pathname;

    const isCurrentRouteActive = (path: string) => {
        if (path === "/") {
            return currentActivePath === path;
        }
        return currentActivePath.startsWith(path);
    };

    return { isCurrentRouteActive };
}
