"use client";

import { useSyncExternalStore } from "react";
import { isDiscreetEnabled, setDiscreet } from "@/lib/discreet";
import { IconLock } from "@/components/icons";

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
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs text-muted hover:text-primary"
      title="מצב דיסקרטי: ללא analytics וללא cookies שיווקיים"
    >
      <IconLock width={16} height={16} />
      {on ? "דיסקרטי פעיל" : "מצב דיסקרטי"}
    </button>
  );
}
