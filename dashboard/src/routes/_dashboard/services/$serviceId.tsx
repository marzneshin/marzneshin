import {
    createFileRoute,
    defer,
    Await,
    Outlet,
} from "@tanstack/react-router";
import {
    RouterServiceContext,
    fetchService,
} from "@marzneshin/modules/services";
import { Suspense } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    Loading
} from "@marzneshin/common/components";

const ServiceProvider = () => {
    const { service } = Route.useLoaderData()
    return (
        <Suspense fallback={<Loading />}>
            <Await promise={service}>
                {(service) => (
                    <RouterServiceContext.Provider value={{ service }}>
                        <Suspense>
                            <Outlet />
                        </Suspense>
                    </RouterServiceContext.Provider>
                )}
            </Await>
        </Suspense>
    )
}

export const Route = createFileRoute('/_dashboard/services/$serviceId')({
    loader: async ({ params }) => {
        const servicePromise = fetchService({
            queryKey: ["services", Number.parseInt(params.serviceId)]
        });

        return {
            service: defer(servicePromise)
        }
    },
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    ),
    component: ServiceProvider,
})
