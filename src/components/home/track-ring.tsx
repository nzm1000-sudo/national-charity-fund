import type { ReactNode } from "react";
import Link from "next/link";
import { trackColor } from "@/lib/tracks";
import { TRACK_ICONS } from "@/components/icons";

export interface TrackItem {
  code: string;
  name: string;
  tagline: string;
  route: string;
}

function TrackChip({ track, compact = false }: { track: TrackItem; compact?: boolean }) {
  const color = trackColor(track.code);
  const Icon = TRACK_ICONS[track.code as keyof typeof TRACK_ICONS] ?? TRACK_ICONS.general;
  return (
    <Link
      href={track.route}
      className="group block overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 pb-4 pt-3 text-center shadow-[var(--shadow-surface)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-raised)]"
    >
      <span className="mx-auto mb-3 block h-0.5 w-10 rounded-full" style={{ background: color }} />
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-full" style={{ color }}>
        <Icon width={24} height={24} />
      </span>
      <span className={compact ? "mt-2 block font-medium text-[var(--color-text)]" : "mt-2.5 block font-display text-lg font-black text-[var(--color-text)]"}>
        {track.name}
      </span>
      {!compact && (
        <span className="mt-1 block text-[var(--text-caption)] leading-relaxed text-[var(--color-text-muted)]">
          {track.tagline}
        </span>
      )}
    </Link>
  );
}

/**
 * The five tracks set at equal spacing on a circle around the seal (desktop),
 * and as a tidy vertical list under it on mobile. The circle is the app's
 * spiritual-circle idea carried into the site.
 */
export function TrackRing({ tracks, children }: { tracks: TrackItem[]; children: ReactNode }) {
  const radius = 42;
  return (
    <div>
      {/* Mobile: the seal first, then a tidy vertical list under it. */}
      <div className="grid place-items-center lg:hidden">{children}</div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:hidden">
        {tracks.map((t) => (
          <li key={t.code}>
            <TrackChip track={t} compact />
          </li>
        ))}
      </ul>

      {/* Desktop: the five tracks at equal spacing on a circle around the seal. */}
      <div className="relative mx-auto hidden h-[620px] w-[620px] lg:block">
        <div className="absolute inset-0 grid place-items-center">{children}</div>
        {tracks.map((t, i) => {
          const angle = ((-90 + i * (360 / tracks.length)) * Math.PI) / 180;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          return (
            <div
              key={t.code}
              className="absolute w-44"
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
            >
              <TrackChip track={t} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
