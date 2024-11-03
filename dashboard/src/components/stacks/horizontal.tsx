import type { FC, PropsWithChildren, HTMLAttributes } from "react";
import { cn } from "@marzneshin/common/utils";

export const HStack: FC<PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
}) => {
    return <div className={cn("flex flex-row gap-2", className)}>{children}</div>;
};
