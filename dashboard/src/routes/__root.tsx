import { TooltipProvider } from '@marzneshin/components';
import { ThemeProvider } from '@marzneshin/features/theme-switch'
import { queryClient } from '@marzneshin/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router'
import React, { Suspense } from 'react'

const TanStackRouterDevtools =
    import.meta.env.NODE_ENV === 'production'
        ? () => null
        : React.lazy(() =>
            import('@tanstack/router-devtools').then((res) => ({
                default: res.TanStackRouterDevtools,
            })),
        )

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <TooltipProvider>
                    <Suspense>
                        <Outlet />
                        <TanStackRouterDevtools />
                    </Suspense>
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    ),
})
