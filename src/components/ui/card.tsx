import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** A surface layer with a two-tone edge (light top, dark bottom). */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("layer-surface", className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function Badge({
  className,
  tone = "neutral",
  ...props
}: ComponentProps<"span"> & {
  tone?: "neutral" | "primary" | "gold" | "danger" | "success";
}) {
  const tones = {
    neutral:
      "bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border-[var(--color-border)]",
    primary:
      "bg-[var(--color-primary-soft)] text-[var(--color-accent)] border-transparent",
    gold: "bg-[var(--color-gold-soft)] text-[var(--color-text)] border-transparent",
    danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)] border-transparent",
    success:
      "bg-[var(--color-success-soft)] text-[var(--color-success)] border-transparent",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-sm)] border px-2.5 py-1 text-[var(--text-caption)] font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
