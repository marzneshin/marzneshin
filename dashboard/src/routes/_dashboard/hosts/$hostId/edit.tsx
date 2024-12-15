import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    HostsMutationDialog,
    useRouterHostContext,
} from "@marzneshin/modules/hosts";

const HostEdit = () => {
    const value = useRouterHostContext()
    const navigate = useNavigate({ from: "/hosts/$hostId/edit" });

    return value && (
        <HostsMutationDialog
            entity={value.host}
            protocol={value.host.protocol}
            onClose={() => navigate({ to: "/hosts" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/edit')({
    component: HostEdit
})
