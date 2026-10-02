import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"span"> & { tone?: "neutral" | "primary" | "gold" | "danger" | "success" }) {
  const tones = {
    neutral: "bg-surface-2 text-ink-soft border-border",
    primary: "bg-primary-soft text-primary-strong border-transparent",
    gold: "bg-gold-soft text-ink border-transparent",
    danger: "bg-danger-soft text-danger border-transparent",
    success: "bg-success-soft text-success border-transparent",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
