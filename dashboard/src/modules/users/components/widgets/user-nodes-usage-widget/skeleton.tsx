import {
    Skeleton,
} from "@marzneshin/common/components";
export function UsageGraphSkeleton() {
    return (
        <div className="p-4 rounded-lg bg-muted">
            <div className="mb-4">
                <Skeleton className="h-6 w-1/4" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded" />
                <Skeleton className="h-32 w-full rounded" />
                <Skeleton className="h-32 w-full rounded" />
                <Skeleton className="h-32 w-full rounded" />
            </div>
        </div>
    )
}
