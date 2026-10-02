import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={cn("py-12 sm:py-16", className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "start",
  rule = false,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  rule?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        rule && "rule-gold",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-sm font-medium tracking-wide text-gold">{eyebrow}</p>
      )}
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      {lead && (
        <p className="mt-3 text-[17px] leading-relaxed text-ink-soft">{lead}</p>
      )}
    </div>
  );
}
