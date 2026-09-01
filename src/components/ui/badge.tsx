import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-accent text-white hover:bg-brand-accent-hover",
        success:
          "border-transparent bg-[var(--status-success-bg)] text-status-success",
        warning:
          "border-transparent bg-[var(--status-warning-bg)] text-status-warning",
        danger:
          "border-transparent bg-[var(--status-danger-bg)] text-status-danger",
        pending:
          "border-transparent bg-[var(--status-pending-bg)] text-status-pending",
        outline: "text-text-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
