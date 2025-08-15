
export interface PaginatedEntityResult<TEntity> {
    items: Array<TEntity>;
    total: number;
    size: number;
    pages: number;
    page: number;
    links: string[];
}

export const defaultPaginatedResult: PaginatedEntityResult<undefined> = {
    items: [], total: 0, page: 0, size: 50, pages :1, links: [] 
}
