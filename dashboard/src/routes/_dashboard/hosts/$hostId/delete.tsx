import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HostsDeleteConfirmationDialog, useHostQuery } from "@marzneshin/features/hosts";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const HostDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { hostId } = Route.useParams();
    const { data: host } = useHostQuery({ hostId: Number.parseInt(hostId) });
    const navigate = useNavigate({ from: "/hosts/$hostId/delete" });
    return host ? (
        <HostsDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={host}
            onClose={() => navigate({ to: "/hosts" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Host not found</AlertDialogContent>
        </AlertDialog>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/delete')({
    component: HostDelete
})
