"use client";

import { cn } from "@/lib/cn";

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
}

export function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  columns = 1,
}: {
  name: string;
  legend: string;
  options: ChoiceOption[];
  value: string | null;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
}) {
  return (
    <fieldset>
      <legend className="font-display text-xl text-ink">
        {legend}
      </legend>
      <div
        className={cn(
          "mt-6 grid gap-4 auto-rows-fr",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-3",
        )}
      >
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-card border p-4 min-h-16",
                checked
                  ? "border-ink bg-surface-2"
                  : "border-border-strong bg-surface",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-5 w-5 accent-[var(--color-accent)]"
              />
              <span>
                <span className="block font-medium text-[var(--color-text)]">{opt.label}</span>
                {opt.description && (
                  <span className="mt-1 block text-[var(--text-meta)] text-[var(--color-text-muted)]">
                    {opt.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
