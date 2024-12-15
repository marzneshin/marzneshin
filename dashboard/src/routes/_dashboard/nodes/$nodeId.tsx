import {
    createFileRoute,
    defer,
    Await,
    Outlet
} from "@tanstack/react-router";
import {
    fetchNode,
    RouterNodeContext
} from "@marzneshin/modules/nodes";
import { Suspense } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    Loading,
} from "@marzneshin/common/components";

const NodeProvider = () => {
    const { node } = Route.useLoaderData()

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={node}>
                {(node) => (
                    <RouterNodeContext.Provider value={{ node }}>
                        <Suspense>
                            <Outlet />
                        </Suspense>
                    </RouterNodeContext.Provider>
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute('/_dashboard/nodes/$nodeId')({
    loader: async ({ params }) => {
        const nodePromise = fetchNode({
            queryKey: ["nodes", Number.parseInt(params.nodeId)]
        });

        return {
            node: defer(nodePromise)
        }
    },
    component: NodeProvider,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    ),
})
