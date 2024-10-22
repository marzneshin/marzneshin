import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    MutationDialog,
    useRouterNodeContext,
} from "@marzneshin/modules/nodes";

const NodeEdit = () => {
    const value = useRouterNodeContext()
    const navigate = useNavigate({ from: "/nodes/$nodeId/edit" });

    return value && (
        <MutationDialog
            entity={value.node}
            onClose={() => navigate({ to: "/nodes" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/nodes/$nodeId/edit')({
    component: NodeEdit
})
