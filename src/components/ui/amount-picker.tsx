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
      setError(`הסכום המזערי הוא ${formatILS(minAgorot)}`);
      return;
    }
    setError(null);
    onChange(parsed);
  }

  return (
    <div>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
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
                "flex min-h-[80px] items-center justify-center rounded-card border px-4 text-center",
                checked
                  ? "border-ink bg-surface-2 text-ink"
                  : "border-border-strong bg-surface text-ink",
              )}
            >
              <span className="num text-xl font-medium">
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
            "min-h-11 text-meta underline underline-offset-4",
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
              placeholder="סכום"
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
