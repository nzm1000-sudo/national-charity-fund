import { cn } from "@/lib/cn";

/** Calm step indicator — a thin ruled progress line, not a bubbly stepper. */
export function Steps({
  current,
  total,
  labels,
  className,
}: {
  current: number;
  total: number;
  labels?: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`שלב ${current} מתוך ${total}`}
      >
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1",
              i < current ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]",
            )}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[var(--text-caption)] text-[var(--color-text-muted)]">
        <span>שלב <bdi>{current}</bdi> מתוך <bdi>{total}</bdi>{labels?.[current - 1] && ` · ${labels[current - 1]}`}</span>
      </div>
    </div>
  );
}
