import { useState } from "react";

export function usePagination() {
    const [pagination, setPagination] = useState({
        size: 10,
        page: 0,
    });
    const { page, size } = pagination;

    return {
        limit: size,
        onPaginationChange: setPagination,
        pagination,
        skip: page * size,
    };
}
