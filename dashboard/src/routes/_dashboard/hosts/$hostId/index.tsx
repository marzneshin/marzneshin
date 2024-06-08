import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    HostSettingsDialog,
    fetchHost,
} from "@marzneshin/features/hosts";
import { Suspense } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    Loading
} from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const HostOpen = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { host } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/hosts/$hostId" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={host}>
                {(host) => (
                    <HostSettingsDialog
                        open={settingsDialogOpen}
                        onOpenChange={setSettingsDialogOpen}
                        entity={host}
                        onClose={() => navigate({ to: "/hosts" })}
                    />
                )}
            </Await>
        </Suspense>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/')({
    loader: async ({ params }) => {
        const hostPromise = fetchHost({
            queryKey: ["hosts", Number.parseInt(params.hostId)]
        });

        return {
            host: defer(hostPromise)
        }
    },
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Host not found</AlertDialogContent>
        </AlertDialog>
    ),
    component: HostOpen
})
