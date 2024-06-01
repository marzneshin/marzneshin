import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    NodesDeleteConfirmationDialog,
    useNodeQuery,
} from "@marzneshin/features/nodes";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const NodeDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { nodeId } = Route.useParams();
    const { data: node } = useNodeQuery({ nodeId: Number(nodeId) });
    const navigate = useNavigate();

    return node ? (
        <NodesDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={node}
            onClose={() => navigate({ to: "/nodes" })}
        />
    ) : (
        <AlertDialog open={true}>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    );
};

export const Route = createFileRoute("/_dashboard/nodes/$nodeId/delete")({
    component: NodeDelete,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    ),
});
