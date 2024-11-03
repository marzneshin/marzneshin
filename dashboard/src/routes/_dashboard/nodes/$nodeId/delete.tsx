import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    NodesDeleteConfirmationDialog,
    useRouterNodeContext,
} from "@marzneshin/modules/nodes";
import { useDialog } from "@marzneshin/common/hooks";

const NodeDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const value = useRouterNodeContext()
    const navigate = useNavigate({ from: "/nodes/$nodeId/delete" });

    return value && (
        <NodesDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={value.node}
            onClose={() => navigate({ to: "/nodes" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/nodes/$nodeId/delete')({
    component: NodeDelete,
})
