"use client";

import { useSyncExternalStore } from "react";
import { isDiscreetEnabled, setDiscreet } from "@/lib/discreet";

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
      className="privacy-control whitespace-nowrap"
      title="מצב צנעה, ללא מעקב וללא תנועה"
    >
      מצב צנעה{on ? " · פעיל" : ""}
    </button>
  );
}
