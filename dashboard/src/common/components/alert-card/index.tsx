import { Info, OctagonAlert, TriangleAlert } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@marzneshin/common/components";
import { cn } from "@marzneshin/common/utils";

interface AlertCardProps {
    variant?: "warning" | "default" | "destructive";
    title: string | JSX.Element;
    size?: "wide-full" | "inline";
    desc?: string | JSX.Element;
}

export const AlertCard = ({
    title,
    desc,
    variant = "default",
    size = "inline",
}: AlertCardProps) => {
    const Icon =
        variant === "warning"
            ? TriangleAlert
            : variant === "destructive"
              ? OctagonAlert
              : Info;
    return (
        <Alert
            variant={variant}
            className={cn({
                "flex flex-col justify-center items-center max-h-full h-[5.8rem] w-full gap-2 border-0":
                    size === "wide-full",
            })}
        >
            <div>
                <Icon
                    className={cn("size-8", {
                        "": (size = "inline"),
                    })}
                />
            </div>
            <AlertTitle className="font-semibold">{title}</AlertTitle>
            <AlertDescription>{desc}</AlertDescription>
        </Alert>
    );
};
