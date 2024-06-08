import {
    createFileRoute,
    useNavigate,
    defer,
    Await,
} from "@tanstack/react-router";
import {
    UsersDeleteConfirmationDialog,
    fetchUser,
} from "@marzneshin/features/users";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";
import { Suspense } from "react";

const UserDelete = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog(true);
    const { user } = Route.useLoaderData()
    const navigate = useNavigate();

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={user}>
                {(user) => (
                    <UsersDeleteConfirmationDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        entity={user}
                        onClose={() => navigate({ to: "/users" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute("/_dashboard/users/$userId/delete")({
    loader: async ({ params }) => {
        const userPromise = fetchUser({ queryKey: ["users", params.userId] });

        return {
            user: defer(userPromise)
        }
    },
    component: UserDelete,
    staleTime: 10_000,
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>User not found</AlertDialogContent>
        </AlertDialog>
    ),
});
