import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    HostsDeleteConfirmationDialog,
    useRouterHostContext,
} from "@marzneshin/modules/hosts";
import { useDialog } from "@marzneshin/common/hooks";

const HostDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const value = useRouterHostContext()
    const navigate = useNavigate({ from: "/hosts/$hostId/delete" });

    return value && (
        <HostsDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={value.host}
            onClose={() => navigate({ to: "/hosts" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/delete')({
    component: HostDelete,
})
