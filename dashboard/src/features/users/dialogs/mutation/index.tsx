import type { FC } from "react";
import { useCallback } from "react";
import {
  DialogTitle,
  DialogContent,
  Dialog,
  DialogHeader,
  Form,
  Button,
  ScrollArea,
  VStack,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import type { UserMutationType } from "@marzneshin/features/users";
import {
  DATA_LIMIT_METRIC,
  useUsersCreationMutation,
  useUsersUpdateMutation,
} from "@marzneshin/features/users";

import { UserSchema } from "./schema";
import { UsernameField, NoteField, ServicesField } from "./fields";
import { useMutationDialog } from "@marzneshin/hooks";
import { DataLimitFields, ExpirationMethodFields } from "./sections";

interface UsersMutationDialogProps {
  entity: UserMutationType | null;
  open: boolean;
  onOpenChange: (state: boolean) => void;
}

export const UsersMutationDialog: FC<UsersMutationDialogProps> = ({
  entity,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const getDefaultValues = useCallback(
    (): UserMutationType => ({
      services: [],
      data_limit: 1,
      expire: null,
      username: "",
      data_limit_reset_strategy: "no_reset",
      status: "active",
      note: "",
      on_hold_expire_duration: 0,
      on_hold_timeout: undefined,
    }),
    [],
  );

  const { form, handleSubmit } = useMutationDialog({
    entity,
    onOpenChange,
    createMutation: useUsersCreationMutation(),
    updateMutation: useUsersUpdateMutation(),
    schema: UserSchema,
    getDefaultValue: getDefaultValues,
    loadFormtter: (d) => ({
      ...d,
      data_limit: (d.data_limit ? d.data_limit : 0) / DATA_LIMIT_METRIC,
    }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={true}>
      <DialogContent className="min-w-full h-full md:h-[42rem] md:min-w-[42rem]">
        <ScrollArea className="flex flex-col justify-between h-full p-0">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {entity
                ? t("page.users.dialogs.edition.title")
                : t("page.users.dialogs.creation.title")}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="">
              <div className="flex-col grid-cols-2 gap-2 sm:flex md:grid h-full">
                <div>
                  <UsernameField disabled={!!entity?.username} />
                  <DataLimitFields />
                  <ExpirationMethodFields entity={entity} />
                  <NoteField />
                </div>
                <VStack>
                  <ServicesField />
                </VStack>
              </div>
            </form>
          </Form>
          <Button
            className="mt-3 w-full font-semibold"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t("submit")}
          </Button>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
