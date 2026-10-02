import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";
interface CommonProps { variant?: Variant; size?: Size; fullWidth?: boolean }
const variants = { primary: "button-primary", secondary: "button-secondary", ghost: "button-ghost", danger: "button-primary" };
const sizes = { sm: "min-h-11", md: "min-h-12", lg: "min-h-16" };
export function Button({ variant = "primary", size = "md", fullWidth, className, ...props }: CommonProps & ComponentProps<"button">) {
  return <button className={cn("institution-button", variants[variant], sizes[size], fullWidth && "w-full", className)} {...props} />;
}
export function ButtonLink({ variant = "primary", size = "md", fullWidth, className, ...props }: CommonProps & ComponentProps<typeof Link>) {
  return <Link className={cn("institution-button", variants[variant], sizes[size], fullWidth && "w-full", className)} {...props} />;
}
