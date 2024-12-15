import type { FC, PropsWithChildren, HTMLAttributes } from "react";
import { cn } from "@marzneshin/common/utils";

export const VStack: FC<PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({
    children,
    className,
    ...props
}) => {
    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            {children}
        </div>
    );
};
