import { CircularProgress } from "@nextui-org/progress";
import {
    TableCell,
    TableRow,
} from "@marzneshin/components";
import type { FC } from "react";

export const CircularProgressBarRow: FC<{
    label: string;
    value: number;
    limit: number;
}> = ({ label, value, limit }) => (
    <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell>
            <CircularProgress size="sm" value={(value / limit) * 100} />
        </TableCell>
    </TableRow>
);
