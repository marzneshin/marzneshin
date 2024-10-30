import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HostsMutationDialog } from "@marzneshin/modules/hosts";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";

const HostCreate = () => {
    const { inboundId } = Route.useParams();
    const navigate = useNavigate({ from: "/hosts/$inboundId/create" });

    return (
        <HostsMutationDialog
            entity={null}
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
