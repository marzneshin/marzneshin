import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    HostsMutationDialog,
    fetchHost,
} from "@marzneshin/features/hosts";
import { Suspense } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    Loading
} from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";


const HostEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { host } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/hosts/$hostId/edit" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={host}>
                {(host) => (
                    <HostsMutationDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        entity={host}
                        onClose={() => navigate({ to: "/hosts" })}
                    />
                )}
            </Await>
        </Suspense>
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/edit')({
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
    component: HostEdit
})
