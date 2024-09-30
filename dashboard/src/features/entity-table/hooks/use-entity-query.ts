
export interface PaginatedEntityQueryProps {
    page: number;
    size: number;
}

export type FilteredEntityType = {
    [key: string]: string | undefined;
}

export interface SortedEntityQueryProps {
    sortBy: string
    desc: boolean
}

interface FiltersEntityQueryProps {
    filters: FilteredEntityType;
}

export type UseEntityQueryProps = Partial<FiltersEntityQueryProps> & PaginatedEntityQueryProps & Partial<SortedEntityQueryProps>

export type EntityName = string;
export type ParentEntityName = string;
export type EntityId = number | string | undefined;
export type PrimaryFilter = string;

export type QueryKey =
    [EntityName, PaginatedEntityQueryProps, PrimaryFilter, SortedEntityQueryProps, FiltersEntityQueryProps]
export type DoubleEntityQueryKey =
    [EntityName, EntityId, PaginatedEntityQueryProps, PrimaryFilter?, SortedEntityQueryProps?, FiltersEntityQueryProps?]

export type SelectableQueryKey =
    [ParentEntityName, EntityId, EntityName, PaginatedEntityQueryProps, PrimaryFilter, SortedEntityQueryProps, FiltersEntityQueryProps]

export type SidebarQueryKey =
    [EntityName, EntityId, EntityName, PaginatedEntityQueryProps, PrimaryFilter, SortedEntityQueryProps, FiltersEntityQueryProps]

export interface QueryKeyType<QT> {
    queryKey: QT
}

export type EntityQueryKeyType = QueryKeyType<QueryKey>
export type DoubleEntityQueryKeyType = QueryKeyType<DoubleEntityQueryKey>
export type SelectableEntityQueryKeyType = QueryKeyType<SelectableQueryKey>
export type EntitySidebarQueryKeyType = QueryKeyType<SidebarQueryKey>

interface FetchEntityResult<T> {
    pageCount: number
    entities: T[]
}

export type FetchEntityReturn<T> = Promise<FetchEntityResult<T>>
