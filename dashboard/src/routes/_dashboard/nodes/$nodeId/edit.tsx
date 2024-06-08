import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    MutationDialog,
    fetchNode,
} from "@marzneshin/features/nodes";
import { Suspense } from "react";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const NodeEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { node } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/nodes/$nodeId/edit" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={node}>
                {(node) => (
                    <MutationDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        entity={node}
                        onClose={() => navigate({ to: "/nodes" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute("/_dashboard/nodes/$nodeId/edit")({
    loader: async ({ params }) => {
        const nodePromise = fetchNode({ queryKey: ["nodes", Number.parseInt(params.nodeId)] });

        return {
            node: defer(nodePromise)
        }
    },
    component: NodeEdit,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    ),
});
