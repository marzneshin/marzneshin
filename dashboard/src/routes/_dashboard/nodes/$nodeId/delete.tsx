import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    NodesDeleteConfirmationDialog,
    fetchNode,
} from "@marzneshin/features/nodes";
import { Suspense } from "react";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const NodeDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { node } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/nodes/$nodeId/delete" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={node}>
                {(node) => (
                    <NodesDeleteConfirmationDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        entity={node}
                        onClose={() => navigate({ to: "/nodes" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute("/_dashboard/nodes/$nodeId/delete")({
    loader: async ({ params }) => {
        const nodePromise = fetchNode({
            queryKey: ["nodes", Number.parseInt(params.nodeId)]
        });

        return {
            node: defer(nodePromise)
        }
    },
    component: NodeDelete,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    ),
});
