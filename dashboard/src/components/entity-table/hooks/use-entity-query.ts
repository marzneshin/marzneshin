import { z } from "zod";

const UseEntityQueryPropsSchema = z.object({
    page: z.number().gte(1),
    size: z.number().gte(1).lte(100)
})

export type UseEntityQueryProps = z.infer<typeof UseEntityQueryPropsSchema>

export type EntityQueryKeyType = { queryKey: [string, number, number] }

interface FetchEntityResult<T> {
    pageCount: number
    entity: T[]
}

export type FetchEntityReturn<T> = Promise<FetchEntityResult<T>>
