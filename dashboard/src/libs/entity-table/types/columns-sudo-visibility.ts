import type { ColumnDef } from "@tanstack/react-table";

export type ColumnDefWithSudoRole<TData> = ColumnDef<TData> & {
    sudoVisibleOnly?: boolean,
};
