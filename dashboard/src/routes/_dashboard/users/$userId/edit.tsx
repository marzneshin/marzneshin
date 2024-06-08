import {
    createFileRoute,
    useNavigate,
} from "@tanstack/react-router";
import {
    UsersMutationDialog,
    useRouterUserContext,
} from "@marzneshin/features/users";
import { useDialog } from "@marzneshin/hooks";


const UserEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const value = useRouterUserContext()
    const navigate = useNavigate({ from: "/users/$userId/edit" });

    return value && (
        <UsersMutationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            entity={value.user}
            onClose={() => navigate({ to: "/users" })}
        />
    );
}

export const Route = createFileRoute('/_dashboard/users/$userId/edit')({
    component: UserEdit
})
