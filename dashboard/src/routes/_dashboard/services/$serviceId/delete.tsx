import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    ServicesDeleteConfirmationDialog,
    useRouterServiceContext,
} from "@marzneshin/modules/services";
import { useDialog } from "@marzneshin/common/hooks";

const ServiceDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const value = useRouterServiceContext()
    const navigate = useNavigate({ from: "/services/$serviceId/delete" });

    return value && (
        <ServicesDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={value.service}
            onClose={() => navigate({ to: "/services" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/services/$serviceId/delete')({
    component: ServiceDelete,
})
