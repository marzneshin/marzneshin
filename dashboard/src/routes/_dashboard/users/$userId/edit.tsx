import {
    createFileRoute,
    useNavigate,
    defer,
    Await,
} from "@tanstack/react-router";
import { UsersMutationDialog, fetchUser } from "@marzneshin/features/users";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { Suspense } from "react";
import { useDialog } from "@marzneshin/hooks";

const UserEdit = () => {
    const [editDialogOpen, setEditDialogOpen] = useDialog(true);
    const { user } = Route.useLoaderData()
    const navigate = useNavigate();

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={user}>
                {(user) => (
                    <UsersMutationDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        entity={user}
                        onClose={() => navigate({ to: "/users" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute("/_dashboard/users/$userId/edit")({
    loader: async ({ params }) => {
        const userPromise = fetchUser({ queryKey: ["users", params.userId] });

        return {
            user: defer(userPromise)
        }
    },
    staleTime: 10_000,
    component: UserEdit,
    errorComponent: () => (
        <AlertDialog>
            <AlertDialogContent>User not found</AlertDialogContent>
        </AlertDialog>
    )
});
