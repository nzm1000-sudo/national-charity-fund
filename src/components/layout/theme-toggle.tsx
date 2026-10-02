"use client";

import { useSyncExternalStore } from "react";
import { THEMES, THEME_LABELS, getStoredTheme, setTheme, type Theme } from "@/lib/theme";
import { isDiscreetEnabled } from "@/lib/discreet";
import { cn } from "@/lib/cn";

const SWATCH: Record<Theme, string> = {
  light: "#f5f2ea",
  dark: "#101512",
  amber: "#211d2b",
};

function subscribe(cb: () => void) {
  window.addEventListener("theme-change", cb);
  window.addEventListener("discreet-change", cb);
  return () => {
    window.removeEventListener("theme-change", cb);
    window.removeEventListener("discreet-change", cb);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getStoredTheme, () => "light" as Theme);
  const discreet = useSyncExternalStore(subscribe, isDiscreetEnabled, () => false);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1"
      role="group"
      aria-label="ערכת נושא"
    >
      {THEMES.map((t) => {
        const active = !discreet && theme === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            aria-pressed={active}
            title={`ערכת ${THEME_LABELS[t]}`}
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full transition-[box-shadow,transform] duration-150",
              active && "ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-[var(--color-surface)]",
            )}
          >
            <span
              className="h-4 w-4 rounded-full border border-[var(--color-border-strong)]"
              style={{ background: SWATCH[t] }}
            />
            <span className="sr-only">ערכת {THEME_LABELS[t]}</span>
          </button>
        );
      })}
    </div>
  );
}
