import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    AdminsDeleteConfirmationDialog,
    useRouterAdminContext,
} from "@marzneshin/modules/admins";
import { useDialog } from "@marzneshin/common/hooks";

const AdminDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const value = useRouterAdminContext()
    const navigate = useNavigate({ from: "/admins/$adminId/delete" });

    return !!(value?.admin) && (
        <AdminsDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={value.admin}
            onClose={() => navigate({ to: "/admins" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/admins/$adminId/delete')({
    component: AdminDelete,
})
