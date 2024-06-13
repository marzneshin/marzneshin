import { Badge } from "@marzneshin/components";

export const DashboardFooter = () => {
    return (
        <div className="size-full flex justify-center items-center dark:text-neutral-300 text-neutral-800">
            <Badge >
            {import.meta.env.VITE_LATEST_APP_VERSION} Marzneshin
            </Badge>
        </div>
    )
}
