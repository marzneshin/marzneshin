import { z } from "zod";

const UseEntityQueryPropsSchema = z.object({
    page: z.number().gte(1),
    size: z.number().gte(1).lte(100),
    search: z.string().optional()
})

export interface SortableEntitySortQueryProps {
    sortBy: string
    desc: boolean
}

export type UseEntityQueryProps = z.infer<typeof UseEntityQueryPropsSchema & SortableEntitySortQueryProps>

export type QueryKey =
    [string, number, number, string]
export type SortableQueryKey =
    [string, number, number, string, string, boolean]
export type SidebarQueryKey =
    [string, number | string | undefined, string, number, number, string]
export type SortableSidebarQueryKey =
    [string, number | string | undefined, string, number, number, string, string, boolean]

export interface QueryKeyType<QT> {
    queryKey: QT
}

export type EntityQueryKeyType = QueryKeyType<SortableQueryKey | QueryKey>
export type EntitySidebarQueryKeyType = QueryKeyType<SortableSidebarQueryKey | SidebarQueryKey>

interface FetchEntityResult<T> {
    pageCount: number
    entity: T[]
}

export type FetchEntityReturn<T> = Promise<FetchEntityResult<T>>
