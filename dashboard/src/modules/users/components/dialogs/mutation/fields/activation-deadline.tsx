import { NumberField } from "@marzneshin/common/components";
import { FC } from "react";

export const ActivationDeadlineField: FC = () => {
    return <NumberField name="activation_deadline" label="page.users.activation_deadline" />;
};
