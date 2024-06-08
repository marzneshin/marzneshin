import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    ServicesDeleteConfirmationDialog,
    fetchService,
} from "@marzneshin/features/services";
import { Suspense } from "react";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const ServiceDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { service } = Route.useLoaderData()
    const navigate = useNavigate();

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={service}>
                {(service) => (
                    <ServicesDeleteConfirmationDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        entity={service}
                        onClose={() => navigate({ to: "/services" })}
                    />
                )}
            </Await>
        </Suspense>
    )
};

export const Route = createFileRoute("/_dashboard/services/$serviceId/delete")({
    loader: async ({ params }) => {
        const servicePromise = fetchService({ queryKey: ["services", Number.parseInt(params.serviceId)] });

        return {
            service: defer(servicePromise)
        }
    },
    component: ServiceDelete,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    ),
});
