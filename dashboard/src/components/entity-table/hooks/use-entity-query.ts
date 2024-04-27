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

export type QueryKey = [string, number, number, string]
export type SortableQueryKey = [string, number, number, string, string, boolean]

export interface QueryKeyType<QT> {
    queryKey: QT
}

export type EntityQueryKeyType = QueryKeyType<QueryKey>
export type SortableEntityQueryKeyType = QueryKeyType<SortableQueryKey>

interface FetchEntityResult<T> {
    pageCount: number
    entity: T[]
}

export type FetchEntityReturn<T> = Promise<FetchEntityResult<T>>
