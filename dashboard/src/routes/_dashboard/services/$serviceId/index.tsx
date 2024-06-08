import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    useRouterServiceContext,
    ServiceSettingsDialog,
} from "@marzneshin/features/services";
import { useDialog } from "@marzneshin/hooks";

const ServiceOpen = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const value = useRouterServiceContext()
    const navigate = useNavigate({ from: "/services/$serviceId" });

    return value && (
        <ServiceSettingsDialog
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
            entity={value.service}
            onClose={() => navigate({ to: "/services" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/services/$serviceId/')({
    component: ServiceOpen
})
