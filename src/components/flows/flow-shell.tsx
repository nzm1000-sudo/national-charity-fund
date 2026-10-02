import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/section";

export function FlowShell({
  eyebrow,
  title,
  lead,
  aside,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Section className="pt-10 sm:pt-12">
      <div className="container-page">
        <nav aria-label="מיקום" className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-primary">
            בית
          </Link>
          <span aria-hidden className="px-2">
            /
          </span>
          <span className="text-ink-soft">{title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div>
            {eyebrow && (
              <p className="mb-2 text-sm font-medium text-gold">{eyebrow}</p>
            )}
            <h1 className="text-3xl sm:text-4xl">{title}</h1>
            {lead && (
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-soft">
                {lead}
              </p>
            )}
            <div className="mt-10">{children}</div>
          </div>

          {aside && (
            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              {aside}
            </aside>
          )}
        </div>
      </div>
    </Section>
  );
}
