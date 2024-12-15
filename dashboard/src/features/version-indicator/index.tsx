import { Badge } from "@marzneshin/common/components";

export const VersionIndicator = () => {
    return (
        <div className="size-full flex justify-center items-center dark:text-neutral-300 text-neutral-800">
            <Badge variant="outline" className="border-none">
                {import.meta.env.VITE_LATEST_APP_VERSION}
            </Badge>
        </div>
    )
}
