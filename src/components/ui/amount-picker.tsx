"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatILS, parseAmountToAgorot } from "@/lib/money";
import { Input } from "@/components/ui/form";

/**
 * Amount picker: symmetric preset buttons with large tabular numerals, plus a
 * free "other" amount. Amounts are agorot. RTL-safe via the .num helper.
 */
export function AmountPicker({
  presets,
  value,
  onChange,
  minAgorot = 100,
  currencyLabel = "₪",
}: {
  presets: number[];
  value: number | null;
  onChange: (agorot: number | null) => void;
  minAgorot?: number;
  currencyLabel?: string;
}) {
  const isPreset = value != null && presets.includes(value);
  const [custom, setCustom] = useState(
    isPreset || value == null ? "" : String(value / 100),
  );
  const [customOpen, setCustomOpen] = useState(!isPreset && value != null);
  const [error, setError] = useState<string | null>(null);

  function choosePreset(amount: number) {
    setCustomOpen(false);
    setError(null);
    onChange(amount);
  }

  function chooseCustom(raw: string) {
    setCustom(raw);
    const parsed = parseAmountToAgorot(raw);
    if (raw.trim() === "") {
      onChange(null);
      setError(null);
      return;
    }
    if (parsed == null) {
      onChange(null);
      setError("יש להזין סכום תקין");
      return;
    }
    if (parsed < minAgorot) {
      onChange(null);
      setError(`הסכום המינימלי הוא ${formatILS(minAgorot)}`);
      return;
    }
    setError(null);
    onChange(parsed);
  }

  return (
    <div>
      <div
        className="grid grid-cols-3 gap-3 sm:grid-cols-4"
        role="group"
        aria-label="בחירת סכום"
      >
        {presets.map((amount) => {
          const checked = value === amount && !customOpen;
          return (
            <button
              key={amount}
              type="button"
              aria-pressed={checked}
              onClick={() => choosePreset(amount)}
              className={cn(
                "flex min-h-[64px] items-center justify-center rounded-[var(--radius-card)] border px-3 text-center transition-[background-color,border-color,transform] duration-150",
                checked
                  ? "border-[var(--color-accent)] bg-[var(--color-primary-tint)] text-[var(--color-accent)] shadow-[var(--shadow-hair)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border-strong)]",
              )}
            >
              <span className="num font-display text-[var(--text-xl)] font-black">
                {formatILS(amount)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => {
            setCustomOpen(true);
            onChange(null);
          }}
          aria-expanded={customOpen}
          className={cn(
            "text-[var(--text-meta)] underline decoration-dotted underline-offset-4",
            customOpen
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]",
          )}
        >
          סכום אחר
        </button>

        {customOpen && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[var(--text-lg)] text-[var(--color-text-muted)]" aria-hidden>
              {currencyLabel}
            </span>
            <Input
              type="text"
              inputMode="decimal"
              value={custom}
              onChange={(e) => chooseCustom(e.target.value)}
              placeholder="הזן/י סכום"
              aria-label="סכום בשקלים"
              className="mt-0 max-w-44"
            />
          </div>
        )}
        {error && (
          <p className="mt-2 text-[var(--text-meta)] text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
