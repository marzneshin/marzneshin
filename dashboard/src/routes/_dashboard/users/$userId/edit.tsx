import { createFileRoute } from "@tanstack/react-router";
import { UsersMutationDialog, useUserQuery } from "@marzneshin/features/users";
import { AlertDialog, AlertDialogContent } from "@marzneshin/components";
import { useDialog } from "@marzneshin/hooks";

const UserEdit = () => {
  const [editDialogOpen, setEditDialogOpen] = useDialog(true);
  const { userId } = Route.useParams();
  const { data: user } = useUserQuery({ username: userId });

  return user ? (
    <UsersMutationDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      entity={user}
    />
  ) : (
    <AlertDialog>
      <AlertDialogContent>User not found</AlertDialogContent>
    </AlertDialog>
  );
};

export const Route = createFileRoute("/_dashboard/users/$userId/edit")({
  component: UserEdit,
});
