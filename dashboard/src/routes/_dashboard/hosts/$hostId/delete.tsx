import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    HostsDeleteConfirmationDialog,
    fetchHost,
} from "@marzneshin/features/hosts";
import { Suspense } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    Loading
} from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const HostDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { host } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/hosts/$hostId/delete" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={host}>
                {(host) => (
                    <HostsDeleteConfirmationDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        entity={host}
                        onClose={() => navigate({ to: "/hosts" })}
                    />
                )}
            </Await>
        </Suspense>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/delete')({
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
    component: HostDelete,
})
