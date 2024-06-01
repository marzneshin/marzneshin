import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NodesSettingsDialog, useNodeQuery } from "@marzneshin/features/nodes";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const NodeSetting = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { nodeId } = Route.useParams();
    const { data: node } = useNodeQuery({ nodeId: Number(nodeId) });
    const navigate = useNavigate({ from: "/nodes/$nodeId" });

    return node ? (
        <NodesSettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            entity={node}
            onClose={() => navigate({ to: "/nodes" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    );
};

export const Route = createFileRoute('/_dashboard/nodes/$nodeId/')({
    component: NodeSetting
})
