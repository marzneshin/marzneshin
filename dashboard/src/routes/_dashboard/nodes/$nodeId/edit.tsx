import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MutationDialog, useNodeQuery } from "@marzneshin/features/nodes";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const NodeEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { nodeId } = Route.useParams();
    const { data: node } = useNodeQuery({ nodeId: Number(nodeId) });
    const navigate = useNavigate({ from: "/nodes/$nodeId/edit"});

    return node ? (
        <MutationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            entity={node}
            onClose={() => navigate({ to: "/nodes" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    );
};

export const Route = createFileRoute("/_dashboard/nodes/$nodeId/edit")({
    component: NodeEdit,
});
