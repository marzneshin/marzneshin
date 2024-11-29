import { TooltipProvider, Loading } from '@marzneshin/common/components';
import { ThemeProvider } from '@marzneshin/features/theme-switch'
import { queryClient } from '@marzneshin/common/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Suspense, useState, useEffect } from 'react'

export const Route = createRootRoute({
    component: () => {
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
            setIsLoading(false);
        }, []);

        return (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                    <TooltipProvider>
                        <Suspense fallback={<Loading />}>
                            <Outlet />
                        </Suspense>
                    </TooltipProvider>
                </ThemeProvider>
                {isLoading && <Loading />}
            </QueryClientProvider>
        );
    },
})
