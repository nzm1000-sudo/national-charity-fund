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
      <legend className="font-display text-[var(--text-lg)] font-black text-[var(--color-text)]">
        {legend}
      </legend>
      <div
        className={cn(
          "mt-5 grid gap-3",
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
                "flex cursor-pointer items-start gap-3 rounded-[var(--radius-card)] border p-4 transition-[background-color,border-color,transform] duration-150 min-h-[64px]",
                checked
                  ? "border-[var(--color-accent)] bg-[var(--color-primary-tint)] shadow-[var(--shadow-hair)]"
                  : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]",
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
