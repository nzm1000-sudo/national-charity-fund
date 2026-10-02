import { cn } from "@/lib/cn";

/**
 * The fund's mark: a doorway, an inner line, and a gold point — quiet and
 * grounded, drawn in code so it scales and follows the theme. It reads at
 * small sizes and never shouts over the page colour.
 */
export function LogoMark({
  size = 38,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M17 57 V27 a15 15 0 0 1 30 0 V57"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="butt"
      />
      <path
        d="M25 57 V29 a7 7 0 0 1 14 0 V57"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.4"
      />
      <circle cx="32" cy="35" r="4.4" fill="var(--color-gold)" />
    </svg>
  );
}

export function LogoWordmark({
  size = 38,
  withTagline = false,
  className,
}: {
  size?: number;
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} className="shrink-0 text-[var(--color-text)]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-black tracking-tight text-[var(--color-text)]">
          הקופה הלאומית
        </span>
        {withTagline && (
          <span className="serif mt-1.5 text-[var(--text-caption)] text-[var(--color-text-muted)]">
            להשיב, לתקן ולתת
          </span>
        )}
      </span>
    </span>
  );
}
