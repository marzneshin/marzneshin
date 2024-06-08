import {
    createFileRoute,
    useNavigate,
    defer,
    Await
} from "@tanstack/react-router";
import {
    ServiceSettingsDialog,
    fetchService,
} from "@marzneshin/features/services";
import { Suspense } from "react";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";


const ServiceSetting = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { service } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/services/$serviceId" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={service}>
                {(service) => (
                    <ServiceSettingsDialog
                        open={settingsDialogOpen}
                        onOpenChange={setSettingsDialogOpen}
                        entity={service}
                        onClose={() => navigate({ to: "/services" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};


export const Route = createFileRoute('/_dashboard/services/$serviceId/')({
    loader: async ({ params }) => {
        const servicePromise = fetchService({ queryKey: ["services", Number.parseInt(params.serviceId)] });

        return {
            service: defer(servicePromise)
        }
    },
    component: ServiceSetting,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>Service not found</AlertDialogContent>
        </AlertDialog>
    ),
})
