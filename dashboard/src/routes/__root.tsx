import { ThemeProvider } from '@marzneshin/features/theme-switch'
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
        <>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <Suspense>
                    <Outlet />
                    <TanStackRouterDevtools />
                </Suspense>
            </ThemeProvider>
        </>
    ),
})
