import { CircularProgress } from "@nextui-org/progress";
import {
    TableCell,
    TableRow,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";
import type { FC } from "react";

export const CircularProgressBarRow: FC<{
    label: string;
    value: number;
    limit: number | undefined;
}> = ({ label, value, limit }) => {
    const { t } = useTranslation()
    return (
        <TableRow>
            <TableCell>{label}</TableCell>
            <TableCell>
                {limit ? <CircularProgress size="sm" value={(value / limit) * 100} /> : t("unlimited")}
            </TableCell>
        </TableRow>
    )
};
