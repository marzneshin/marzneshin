import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { UsersMutationDialog } from "@marzneshin/features/users";
import { useDialog } from "@marzneshin/hooks";

const UserCreate = () => {
    const [mutationDialogOpen, setMutationDialogOpen] = useDialog(true);
    const navigate = useNavigate({ from: "/users/create" });
    return (
        <UsersMutationDialog
            open={mutationDialogOpen}
            onOpenChange={setMutationDialogOpen}
            entity={null}
            onClose={() => navigate({ to: "/users" })}
        />
    );
}

export const Route = createFileRoute("/_dashboard/admins/create")({
    component: UserCreate,
});
