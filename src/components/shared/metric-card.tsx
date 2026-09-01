import { cn } from "@/lib/utils/cn";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "flat";
  };
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  trend,
  subtitle,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-4",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {title}
      </p>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums text-text-primary">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend.direction === "up" && "text-status-success",
              trend.direction === "down" && "text-status-danger",
              trend.direction === "flat" && "text-text-muted"
            )}
          >
            {trend.direction === "up" && <ArrowUp className="h-3 w-3" />}
            {trend.direction === "down" && <ArrowDown className="h-3 w-3" />}
            {trend.direction === "flat" && <Minus className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
