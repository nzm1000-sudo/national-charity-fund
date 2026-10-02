import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return <section className={cn("institution-section", className)} {...props}>{children}</section>;
}
export function SectionHeading({ eyebrow, title, lead, align: _align, rule: _rule, className }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; align?: "start" | "center"; rule?: boolean; className?: string }) {
  return <div className={cn("mx-auto text-center", className)}>{eyebrow && <p className="eyebrow mx-auto">{eyebrow}</p>}<h2 className="section-title">{title}</h2>{lead && <p className="section-lead">{lead}</p>}</div>;
}
