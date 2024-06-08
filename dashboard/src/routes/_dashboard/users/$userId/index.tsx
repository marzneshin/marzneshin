import {
    createFileRoute,
    useNavigate,
    defer,
    Await,
} from "@tanstack/react-router";
import { UsersSettingsDialog, fetchUser } from "@marzneshin/features/users";
import { AlertDialog, AlertDialogContent, Loading } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";
import { Suspense } from "react";

const UserSetting = () => {
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog(true);
    const { user } = Route.useLoaderData()
    const navigate = useNavigate({ from: "/users/$userId" });

    return (
        <Suspense fallback={<Loading />}>
            <Await promise={user}>
                {(user) => (
                    <UsersSettingsDialog
                        open={settingsDialogOpen}
                        onOpenChange={setSettingsDialogOpen}
                        entity={user}
                        onClose={() => navigate({ to: "/users" })}
                    />
                )}
            </Await>
        </Suspense>
    );
};

export const Route = createFileRoute("/_dashboard/users/$userId/")({
    loader: async ({ params }) => {
        const userPromise = fetchUser({ queryKey: ["users", params.userId] });
        return {
            user: defer(userPromise)
        }
    },
    component: UserSetting,
    staleTime: 10_000,
    onError: () => (
        <AlertDialog>
            <AlertDialogContent>User not found</AlertDialogContent>
        </AlertDialog>
    )
});
