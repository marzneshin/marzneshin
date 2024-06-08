import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    MutationDialog,
    useRouterNodeContext,
} from "@marzneshin/features/nodes";
import { useDialog } from "@marzneshin/hooks";


const NodeEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const value = useRouterNodeContext()
    const navigate = useNavigate({ from: "/nodes/$nodeId/edit" });

    return value && (
        <MutationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            entity={value.node}
            onClose={() => navigate({ to: "/nodes" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/nodes/$nodeId/edit')({
    component: NodeEdit
})
