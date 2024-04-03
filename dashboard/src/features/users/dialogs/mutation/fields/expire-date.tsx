import { DateField } from "@marzneshin/features/users";
import { FC } from "react";

export const ExpireDateField: FC = () => {
  return <DateField name="expire" label="page.users.expire_date" />;
};
