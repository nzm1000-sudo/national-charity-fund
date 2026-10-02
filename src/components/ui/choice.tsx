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
      <legend className="text-[17px] font-medium text-ink">{legend}</legend>
      <div
        className={cn(
          "mt-4 grid gap-3",
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
                "flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors",
                checked
                  ? "border-primary bg-primary-tint"
                  : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
              />
              <span>
                <span className="block font-medium text-ink">{opt.label}</span>
                {opt.description && (
                  <span className="mt-0.5 block text-sm text-muted">
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
