import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
    UsersDeleteConfirmationDialog,
    useUserQuery,
} from "@marzneshin/features/users";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const UserDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { userId } = Route.useParams();
    const { data: user } = useUserQuery({ username: userId });
    const navigate = useNavigate();

    return user ? (
        <UsersDeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            entity={user}
            onClose={() => navigate({ to: "/users" })}
        />
    ) : (
        <AlertDialog open={true}>
            <AlertDialogContent>User not found</AlertDialogContent>
        </AlertDialog>
    );
};

export const Route = createFileRoute("/_dashboard/users/$userId/delete")({
    component: UserDelete,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>User not found</AlertDialogContent>
        </AlertDialog>
    ),
});
