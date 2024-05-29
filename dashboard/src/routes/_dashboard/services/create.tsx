import { createFileRoute } from "@tanstack/react-router";
import { MutationDialog } from "@marzneshin/features/services";
import { useDialog } from "@marzneshin/hooks";

export const Route = createFileRoute("/_dashboard/services/create")({
    component: () => {
        const [createDialogOpen, setCreateDialogOpen] = useDialog(true);
        return (
            <MutationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                entity={null}
            />
        );
    },
});
