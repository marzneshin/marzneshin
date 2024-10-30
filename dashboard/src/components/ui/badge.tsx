import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@marzneshin/common/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                royal:
                    "border-transparent text-indigo-200 bg-indigo-700 hover:bg-indigo/80",
                positive:
                    "border-transparent text-emerald-100 bg-emerald-800 hover:bg-emerald/80",
                disabled:
                    "border-transparent bg-gray-400 text-gray-800 hover:bg-gray/80",
                warning:
                    "border-transparent bg-amber-200 text-amber-700 hover:bg-amber/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

type BadgeVariantKeys =
    | 'default'
    | 'secondary'
    | 'destructive'
    | 'royal'
    | 'positive'
    | 'disabled'
    | 'warning'
    | 'outline';

export { Badge, badgeVariants, type BadgeVariantKeys }
