import { TooltipProvider } from '@marzneshin/components';
import { ThemeProvider } from '@marzneshin/features/theme-switch'
import { queryClient } from '@marzneshin/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <TooltipProvider>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </TooltipProvider>
            </ThemeProvider>
        </QueryClientProvider>
    ),
})
