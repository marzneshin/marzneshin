import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    ServicesDeleteConfirmationDialog,
    useServiceQuery,
} from "@marzneshin/features/services";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const ServiceDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { serviceId } = Route.useParams();
    const { data: service } = useServiceQuery({ servicename: serviceId });
    const navigate = useNavigate();

    return service ? (
        <ServicesDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={service}
            onClose={() => navigate({ to: "/services" })}
        />
    ) : (
        <AlertDialog open={true}>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    );
};

export const Route = createFileRoute("/_dashboard/services/$serviceId/delete")({
    component: ServiceDelete,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    ),
});
