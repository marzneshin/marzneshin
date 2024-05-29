import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ServiceSettingsDialog, useServiceQuery } from "@marzneshin/features/services";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const ServiceSetting = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { serviceId } = Route.useParams();
    const { data: service } = useServiceQuery({ serviceId: Number(serviceId) });
    const navigate = useNavigate({ from: "/services/$serviceId" });

    return service ? (
        <ServiceSettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            entity={service}
            onClose={() => navigate({ to: "/services" })}
        />
    ) : (
        <AlertDialog>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    );
};


export const Route = createFileRoute('/_dashboard/services/$serviceId/')({
    component: ServiceSetting
})
