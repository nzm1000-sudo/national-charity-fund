import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section className={cn("py-16 sm:py-24", className)} {...props}>
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
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-[var(--text-2xl)] sm:text-[var(--text-3xl)]">{title}</h2>
      {lead && (
        <p className="serif mt-4 text-[var(--text-lg)] leading-relaxed text-[var(--color-text-muted)]">
          {lead}
        </p>
      )}
    </div>
  );
}
