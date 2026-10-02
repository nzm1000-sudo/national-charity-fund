import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-surface)] border border-transparent shadow-[var(--shadow-hair)] hover:brightness-[0.94]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
  ghost:
    "bg-transparent text-[var(--color-text-muted)] border border-transparent hover:text-[var(--color-accent)]",
  danger:
    "bg-[var(--color-danger)] text-[var(--color-surface)] border border-transparent hover:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "text-[var(--text-meta)] px-4 py-2 min-h-11 gap-2",
  md: "text-[var(--text-base)] px-5 py-3 min-h-12 gap-2",
  lg: "text-[var(--text-lg)] px-6 py-3.5 min-h-[54px] gap-2",
};

const baseClass =
  "inline-flex items-center justify-center rounded-[var(--radius-card)] font-medium transition-[transform,opacity,background-color,border-color,color] duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:opacity-50 disabled:pointer-events-none";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(baseClass, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(baseClass, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...props}
    />
  );
}
