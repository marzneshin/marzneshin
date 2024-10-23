import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MutationDialog } from "@marzneshin/modules/nodes";

const NodeCreate = () => {
    const navigate = useNavigate({ from: "/nodes/create" });
    return (
        <MutationDialog
            entity={null}
            onClose={() => navigate({ to: "/nodes" })}
        />
    );
}

export const Route = createFileRoute("/_dashboard/nodes/create")({
    component: NodeCreate,
});
