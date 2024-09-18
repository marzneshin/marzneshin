import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    AdminsMutationDialog,
    useRouterAdminContext,
} from "@marzneshin/modules/admins";

const AdminEdit = () => {
    const value = useRouterAdminContext()
    const navigate = useNavigate({ from: "/admins/$adminId/edit" });

    return value && (
        <AdminsMutationDialog
            entity={value.admin}
            onClose={() => navigate({ to: "/admins" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/admins/$adminId/edit')({
    component: AdminEdit
})
