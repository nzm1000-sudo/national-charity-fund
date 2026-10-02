"use client";

import { useId, useState, type ReactNode } from "react";
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
  const id = useId();
  return (
    <div className={cn("border-b border-[var(--color-border)]", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="grid w-full grid-cols-[24px_minmax(0,1fr)_24px] items-center gap-4 py-5 text-center"
      >
        <span className="col-start-2 row-start-1 min-w-0 font-normal text-[var(--color-text)]">{summary}</span>
        <IconChevronDown
          className={cn(
            "col-start-3 row-start-1 shrink-0 text-[var(--color-text-muted)] transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div id={id} className="pb-8 text-center text-base text-muted">
          {children}
        </div>
      )}
    </div>
  );
}
