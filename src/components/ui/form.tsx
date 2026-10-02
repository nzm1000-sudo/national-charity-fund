import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Label({
  className,
  children,
  required,
  ...props
}: ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label
      className={cn("block text-[var(--text-meta)] font-medium text-[var(--color-text)]", className)}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--color-danger)]"> *</span>}
    </label>
  );
}

const controlClass =
  "mt-2 block w-full min-h-12 rounded-card border border-border-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-muted";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, "min-h-28 resize-y", className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  children,
  className,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {hint && !error && (
        <p className="mt-2 text-[var(--text-caption)] text-[var(--color-text-muted)]">{hint}</p>
      )}
      {error && (
        <p className="mt-2 text-[var(--text-meta)] text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
