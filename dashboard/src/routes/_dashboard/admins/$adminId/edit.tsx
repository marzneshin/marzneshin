import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    AdminsMutationDialog,
    useRouterAdminContext,
} from "@marzneshin/features/admins";
import { useDialog } from "@marzneshin/hooks";


const AdminEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const value = useRouterAdminContext()
    const navigate = useNavigate({ from: "/admins/$adminId/edit" });

    return value && (
        <AdminsMutationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            entity={value.admin}
            onClose={() => navigate({ to: "/admins" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/admins/$adminId/edit')({
    component: AdminEdit
})
