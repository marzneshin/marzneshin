import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HostSettingsDialog, useHostQuery } from "@marzneshin/features/hosts";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";


const HostOpen = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { hostId } = Route.useParams();
    const { data: host } = useHostQuery({ hostId: Number.parseInt(hostId) });
    const navigate = useNavigate({ from: "/hosts/$hostId" });
    return host ? (
        <HostSettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            entity={host}
            onClose={() => navigate({ to: "/hosts" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Host not found</AlertDialogContent>
        </AlertDialog>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/')({
    component: HostOpen
})
