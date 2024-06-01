import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HostsMutationDialog, useInboundQuery } from "@marzneshin/features/hosts";
import { useDialog } from "@marzneshin/hooks";

const HostCreate = () => {
    const [createDialogOpen, setCreateDialogOpen] = useDialog(true);
    const { inboundId } = Route.useParams();
    const { data: inbound } = useInboundQuery({ inboundId: Number.parseInt(inboundId) });
    const navigate = useNavigate({ from: "/hosts/$inboundId/create" });
    return (
        <HostsMutationDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            inboundId={Number(inbound.id)}
            onClose={() => navigate({ to: "/hosts" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$inboundId/create')({
    component: HostCreate,
});
