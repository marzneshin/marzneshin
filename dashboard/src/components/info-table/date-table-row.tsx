import { FC } from "react";
import { TableRowWithCell } from "./table-row-with-cell";
import { format, isValid } from "date-fns";

export const DateTableRow: FC<{ label: string; date?: Date | null | string }> = ({
    label,
    date,
}) => {
    let formattedDate = "";
    if (date && isValid(date)) {
        formattedDate = format(date, "PPP");
    }
    return <TableRowWithCell label={label} value={formattedDate} />;
};
