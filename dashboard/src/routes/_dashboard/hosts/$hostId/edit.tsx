import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HostsMutationDialog, useHostQuery } from "@marzneshin/features/hosts";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";


const HostEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { hostId } = Route.useParams();
    const { data: host } = useHostQuery({ hostId: Number.parseInt(hostId) });
    const navigate = useNavigate({ from: "/hosts/$hostId/edit" });
    return host ? (
        <HostsMutationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            entity={host}
            onClose={() => navigate({ to: "/hosts" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Host not found</AlertDialogContent>
        </AlertDialog>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/edit')({
    component: HostEdit
})
