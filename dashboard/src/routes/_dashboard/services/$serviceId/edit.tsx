import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    MutationDialog,
    fetchService,
} from "@marzneshin/features/services";
import { Suspense } from "react";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const ServiceEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { service } = Route.useLoaderData()
    const navigate = useNavigate();

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={service}>
                {(service) => (
                    <MutationDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        entity={service}
                        onClose={() => navigate({ to: "/services" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute("/_dashboard/services/$serviceId/edit")({
    loader: async ({ params }) => {
        const servicePromise = fetchService({ queryKey: ["services", Number.parseInt(params.serviceId)] });

        return {
            service: defer(servicePromise)
        }
    },
    component: ServiceEdit,
    errorComponent: () => (
        <AlertDialog>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    )
});
