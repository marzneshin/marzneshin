import { useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

export function usePagination({ entityKey}: { entityKey: string }) {
    const [rowPerPageLocal] = useLocalStorage<number>(`marzneshin-table-row-per-page-${entityKey}`, 10);
    const [pagination, setPagination] = useState({
        pageSize: rowPerPageLocal,
        pageIndex: 1,
    });
    const { pageSize, pageIndex } = pagination;

    return {
        pageSize,
        pageIndex,
        onPaginationChange: setPagination,
        pagination,
        skip: pageSize * pageIndex,
    };
}
