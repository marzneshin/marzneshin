import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MutationDialog } from "@marzneshin/modules/services";

const ServiceCreate = () => {
    const navigate = useNavigate({ from: "/services/create" });
    return (
        <MutationDialog
            entity={null}
            onClose={() => navigate({ to: "/services" })}
        />
    );
}

export const Route = createFileRoute("/_dashboard/services/create")({
    component: ServiceCreate,
});
