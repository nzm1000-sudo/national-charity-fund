"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatILS, parseAmountToAgorot } from "@/lib/money";
import { Input } from "@/components/ui/form";

/**
 * Amount picker: quick chai presets + a free "other" amount.
 * Amounts are agorot. RTL-safe: the ₪ symbol and digits use the .num helper.
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
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="בחירת סכום">
        {presets.map((amount) => {
          const checked = value === amount && !customOpen;
          return (
            <button
              key={amount}
              type="button"
              aria-pressed={checked}
              onClick={() => choosePreset(amount)}
              className={cn(
                "rounded-md border px-3 py-3 text-center text-[15px] font-medium transition-colors",
                checked
                  ? "border-primary bg-primary-tint text-primary-strong"
                  : "border-border bg-surface text-ink-soft hover:border-border-strong",
              )}
            >
              <span className="num">{formatILS(amount)}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => {
            setCustomOpen(true);
            onChange(null);
          }}
          aria-expanded={customOpen}
          className={cn(
            "text-sm underline decoration-dotted underline-offset-4",
            customOpen ? "text-primary" : "text-ink-soft hover:text-primary",
          )}
        >
          סכום אחר
        </button>

        {customOpen && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-lg text-muted" aria-hidden>
              {currencyLabel}
            </span>
            <Input
              type="text"
              inputMode="decimal"
              value={custom}
              onChange={(e) => chooseCustom(e.target.value)}
              placeholder="הזן/י סכום"
              aria-label="סכום בשקלים"
              className="mt-0 max-w-40"
            />
          </div>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
