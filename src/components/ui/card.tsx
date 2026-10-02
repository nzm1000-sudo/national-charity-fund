import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
export function Card({ className, ...props }: ComponentProps<"div">) { return <div className={cn("layer-surface", className)} {...props} />; }
export function CardBody({ className, ...props }: ComponentProps<"div">) { return <div className={cn("p-8", className)} {...props} />; }
export function Badge({ className, tone: _tone = "neutral", ...props }: ComponentProps<"span"> & { tone?: "neutral" | "primary" | "gold" | "danger" | "success" }) {
  return <span className={cn("inline-flex border border-border px-3 py-1 text-caption text-muted", className)} {...props} />;
}
