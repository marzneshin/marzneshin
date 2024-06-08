import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    NodesSettingsDialog,
    fetchNode,
} from "@marzneshin/features/nodes";
import { Suspense } from "react";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const NodeSetting = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { node } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/nodes/$nodeId" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={node}>
                {(node) => (
                    <NodesSettingsDialog
                        open={settingsDialogOpen}
                        onOpenChange={setSettingsDialogOpen}
                        entity={node}
                        onClose={() => navigate({ to: "/nodes" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute('/_dashboard/nodes/$nodeId/')({
    loader: async ({ params }) => {
        const nodePromise = fetchNode({
            queryKey: ["nodes", Number.parseInt(params.nodeId)]
        });

        return {
            node: defer(nodePromise)
        }
    },
    component: NodeSetting,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Node not found</AlertDialogContent>
        </AlertDialog>
    ),
})
