import { DateField } from "@marzneshin/features/users";
import { FC } from "react";

export const ExpireDateField: FC = () => {
    return <DateField name="expire_date" label="page.users.expire_date" />;
};
