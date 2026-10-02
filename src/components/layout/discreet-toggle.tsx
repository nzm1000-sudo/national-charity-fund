"use client";

import { useSyncExternalStore } from "react";
import { isDiscreetEnabled, setDiscreet } from "@/lib/discreet";
import { IconLock } from "@/components/icons";
import { cn } from "@/lib/cn";

function subscribe(callback: () => void) {
  window.addEventListener("discreet-change", callback);
  return () => window.removeEventListener("discreet-change", callback);
}

export function DiscreetToggle() {
  const on = useSyncExternalStore(subscribe, isDiscreetEnabled, () => false);

  return (
    <button
      type="button"
      onClick={() => setDiscreet(!on)}
      aria-pressed={on}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full border px-3 text-[var(--text-caption)] transition-colors duration-150",
        on
          ? "border-[var(--color-accent)] bg-[var(--color-primary-tint)] text-[var(--color-accent)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]",
      )}
      title="מצב דיסקרטי: ערכה כהה, בלי אנימציות, בלי analytics וללא cookies שיווקיים"
    >
      <IconLock width={16} height={16} />
      <span className="hidden sm:inline">{on ? "דיסקרטי פעיל" : "מצב דיסקרטי"}</span>
    </button>
  );
}
