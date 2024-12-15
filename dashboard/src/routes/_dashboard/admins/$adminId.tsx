import {
    createFileRoute,
    Outlet,
} from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryClient } from "@marzneshin/common/utils";
import {
    RouterAdminContext,
    adminQueryOptions,
} from "@marzneshin/modules/admins";
import { Suspense, useMemo } from "react";
import {
    AlertDialog,
    AlertDialogContent,
} from "@marzneshin/common/components";

const AdminProvider = () => {
    const { username } = Route.useLoaderData()
    const { data: admin, isPending } = useSuspenseQuery(adminQueryOptions({ username }))
    const value = useMemo(() => ({ admin, isPending }), [admin, isPending])
    return (
        <RouterAdminContext.Provider value={value}>
            <Suspense>
                <Outlet />
            </Suspense>
        </RouterAdminContext.Provider>
    )
}

export const Route = createFileRoute('/_dashboard/admins/$adminId')({
    loader: async ({ params }) => {
        queryClient.ensureQueryData(adminQueryOptions({ username: params.adminId }))
        return { username: params.adminId };
    },
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Admin not found</AlertDialogContent>
        </AlertDialog>
    ),
    component: AdminProvider,
})
