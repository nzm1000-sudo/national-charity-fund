"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconChevronDown } from "@/components/icons";

/** Progressive disclosure: short answer first, depth on demand. */
export function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("border-b border-[var(--color-border)]", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-start"
      >
        <span className="font-medium text-[var(--color-text)]">{summary}</span>
        <IconChevronDown
          className={cn(
            "shrink-0 text-[var(--color-text-muted)] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="pb-6 text-[var(--text-base)] leading-relaxed text-[var(--color-text-muted)]">
          {children}
        </div>
      )}
    </div>
  );
}
