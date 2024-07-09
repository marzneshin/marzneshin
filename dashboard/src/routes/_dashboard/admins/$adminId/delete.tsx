import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    UsersDeleteConfirmationDialog,
    useRouterUserContext,
} from "@marzneshin/features/users";
import { useDialog } from "@marzneshin/hooks";

const UserDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const value = useRouterUserContext()
    const navigate = useNavigate({ from: "/admins/$adminId/delete" });

    return !!(value?.user) && (
        <UsersDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={value.user}
            onClose={() => navigate({ to: "/admins" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/admins/$adminId/delete')({
    component: UserDelete,
})
