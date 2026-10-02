import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Label({
  className,
  children,
  required,
  ...props
}: ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label className={cn("block text-sm font-medium text-ink", className)} {...props}>
      {children}
      {required && <span className="text-danger"> *</span>}
    </label>
  );
}

const controlClass =
  "mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3.5 py-3 text-[15px] text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(controlClass, "min-h-24 resize-y", className)} {...props} />;
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
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
