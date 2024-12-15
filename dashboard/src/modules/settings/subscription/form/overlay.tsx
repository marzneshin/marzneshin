import {
    Skeleton,
} from "@marzneshin/common/components";

export const Overlay = () => (
    <div className="grid grid-cols-[2fr,1.3fr,0.25fr,0.25fr] items-center justify-start gap-2 my-0 ">
        <Skeleton className="h-8 w-full rounded-sm" />
        <Skeleton className="h-8 w-full rounded-sm" />
        <Skeleton className="size-8 shrink-0 rounded-sm" />
        <Skeleton className="size-8 shrink-0 rounded-sm" />
    </div>
)
