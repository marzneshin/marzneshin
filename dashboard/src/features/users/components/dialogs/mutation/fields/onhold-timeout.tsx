
import { DateField } from "@marzneshin/features/users";
import { FC } from "react";

export const OnHoldTimeoutField: FC = () => {
    return <DateField name="on_hold_timeout" label="page.users.on_hold_timeout" />;
};
