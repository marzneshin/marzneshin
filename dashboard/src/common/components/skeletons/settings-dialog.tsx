import { Skeleton } from "@marzneshin/common/components";

export const SettingsInfoSkeleton = () => {
    return (
        <div className="p-5 bg-gray-900 rounded-lg w-96">
            <h2 className="text-white mb-5">
                <Skeleton className="h-6 w-24" />
            </h2>
            <div className="mb-2">
                <Skeleton className="h-5 w-36" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-40" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-32" />
            </div>
            <div className="mb-2">
                <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex justify-between mt-5">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
            </div>
        </div>
    );
};
