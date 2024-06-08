import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HostsMutationDialog } from "@marzneshin/features/hosts";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const HostCreate = () => {
    const [createDialogOpen, setCreateDialogOpen] = useDialog(true);
    const { inboundId } = Route.useParams();
    const navigate = useNavigate({ from: "/hosts/$inboundId/create" });

    return (
        <HostsMutationDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            inboundId={Number(inboundId)}
            onClose={() => navigate({ to: "/hosts" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$inboundId/create')({
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Host not found</AlertDialogContent>
        </AlertDialog>
    ),
    component: HostCreate,
});
