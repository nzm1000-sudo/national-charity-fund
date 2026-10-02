"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon, Plus, Minus, RotateCcw } from "lucide-react";
import { getStoredTheme, setTheme, type Theme } from "@/lib/theme";
import { getStoredTextSize, setTextSize, subscribeTextSize, TEXT_SIZE_DEFAULT, TEXT_SIZE_MIN, TEXT_SIZE_MAX, TEXT_SIZE_STEP } from "@/lib/text-size";

function subscribe(cb: () => void) {
  window.addEventListener("theme-change", cb);
  return () => {
    window.removeEventListener("theme-change", cb);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getStoredTheme, () => "light" as Theme);
  const textSize = useSyncExternalStore(subscribeTextSize, getStoredTextSize, () => TEXT_SIZE_DEFAULT);
  const dark = theme === "dark";
  const action = dark ? "מעבר למצב בהיר" : "מעבר למצב כהה";

  return (
    <div className="appearance-controls">
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-pressed={dark}
      aria-label={action}
      title={action}
      className="privacy-control inline-flex min-h-11 items-center gap-2 whitespace-nowrap"
    >
      {dark ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
      {dark ? "מצב כהה" : "מצב בהיר"}
    </button>
    <div className="text-size-controls" role="group" aria-label="גודל טקסט">
      <button type="button" aria-label="הקטנת טקסט" title="הקטנת טקסט" disabled={textSize === TEXT_SIZE_MIN} onClick={() => setTextSize(textSize - TEXT_SIZE_STEP)}><span aria-hidden="true">א</span><Minus size={12} aria-hidden="true" /></button>
      <button type="button" aria-label="הגדלת טקסט" title="הגדלת טקסט" disabled={textSize === TEXT_SIZE_MAX} onClick={() => setTextSize(textSize + TEXT_SIZE_STEP)}><span aria-hidden="true">א</span><Plus size={12} aria-hidden="true" /></button>
      <button type="button" aria-label="איפוס גודל טקסט" title="איפוס גודל טקסט" disabled={textSize === TEXT_SIZE_DEFAULT} onClick={() => setTextSize(TEXT_SIZE_DEFAULT)}><RotateCcw size={15} aria-hidden="true" /></button>
      <output className="sr-only" aria-live="polite">גודל הטקסט: {textSize}%</output>
    </div>
    </div>
  );
}
