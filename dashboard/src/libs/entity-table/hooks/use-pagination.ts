import { useState } from "react";

export function usePagination() {
    const [pagination, setPagination] = useState({
        pageSize: 10,
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
