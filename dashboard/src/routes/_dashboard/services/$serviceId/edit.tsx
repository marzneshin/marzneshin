import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MutationDialog, useServiceQuery } from "@marzneshin/features/services";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const ServiceEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { serviceId } = Route.useParams();
    const { data: service } = useServiceQuery({ serviceId: Number.parseInt(serviceId) });
    const navigate = useNavigate();

    return service ? (
        <MutationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            entity={service}
            onClose={() => navigate({ to: "/services" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    );
};

export const Route = createFileRoute("/_dashboard/services/$serviceId/edit")({
    component: ServiceEdit,
});
