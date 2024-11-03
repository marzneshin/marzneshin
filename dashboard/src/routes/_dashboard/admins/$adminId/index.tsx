import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    useRouterAdminContext,
    AdminsSettingsDialog,
} from "@marzneshin/modules/admins";
import { useDialog } from "@marzneshin/common/hooks";

const AdminOpen = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const value = useRouterAdminContext()
    const navigate = useNavigate({ from: "/admins/$adminId" });

    return value && (
        <AdminsSettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            entity={value.admin}
            isPending={!!value.isPending}
            onClose={() => navigate({ to: "/admins" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/admins/$adminId/')({
    component: AdminOpen
})
