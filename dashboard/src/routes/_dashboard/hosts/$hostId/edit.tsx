import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    HostsMutationDialog,
    useRouterHostContext,
} from "@marzneshin/features/hosts";
import { useDialog } from "@marzneshin/hooks";


const HostEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const value = useRouterHostContext()
    const navigate = useNavigate({ from: "/hosts/$hostId/edit" });

    return value && (
                    <HostsMutationDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        entity={value.host}
                        onClose={() => navigate({ to: "/hosts" })}
                    />
    );
}

export const Route = createFileRoute('/_dashboard/hosts/$hostId/edit')({
    component: HostEdit
})
