import {
    Skeleton,
} from "@marzneshin/components";

export const Overlay = () => (
    <div className="grid grid-cols-[0.67fr,0.3fr,auto,auto] items-center justify-start gap-2 my-2 ">
        <Skeleton className="h-8 w-full rounded-sm" />
        <Skeleton className="h-8 w-full rounded-sm" />
        <Skeleton className="size-8 shrink-0 rounded-sm" />
        <Skeleton className="size-8 shrink-0 rounded-sm" />
    </div>
)
