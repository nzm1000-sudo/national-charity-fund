import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-strong border border-transparent shadow-hair",
  secondary:
    "bg-surface text-ink border border-border-strong hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-ink-soft hover:text-primary border border-transparent",
  danger: "bg-danger text-white hover:opacity-90 border border-transparent",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2 min-h-[38px] rounded-md gap-1.5",
  md: "text-[15px] px-5 py-3 min-h-[48px] rounded-md gap-2",
  lg: "text-base px-6 py-3.5 min-h-[54px] rounded-md gap-2",
};

const baseClass =
  "inline-flex items-center justify-center font-medium transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

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
