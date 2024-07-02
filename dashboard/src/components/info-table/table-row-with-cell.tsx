import {
    TableCell,
    TableRow,
} from "@marzneshin/components";
import { FC } from "react";

export const TableRowWithCell: FC<{
    label: string;
    value?: string | number | JSX.Element | null;
}> = ({ label, value }) => (
    <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell>{value}</TableCell>
    </TableRow>
);
