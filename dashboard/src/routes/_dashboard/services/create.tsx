import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MutationDialog } from "@marzneshin/features/services";
import { useDialog } from "@marzneshin/hooks";

export const Route = createFileRoute("/_dashboard/services/create")({
    component: () => {
        const [createDialogOpen, setCreateDialogOpen] = useDialog(true);
        const navigate = useNavigate({ from: "/services/create" });
        return (
            <MutationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                entity={null}
                onClose={() => navigate({ to: "/services" })}
            />
        );
    },
});
