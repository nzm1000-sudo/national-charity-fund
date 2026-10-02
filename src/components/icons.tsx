import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Returning something to its owner — an open, giving hand. */
export function IconReturn(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 8 5" />
      <path d="M21 4v4h-4" />
      <path d="M8 13c2 2 5 2 7 0" />
      <path d="M8 13l-1.5 3M16 13l1.5 3" />
    </svg>
  );
}

/** Public needs — a communal building / many people. */
export function IconCommunity(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21V9l8-5 8 5v12" />
      <path d="M9 21v-6h6v6" />
      <path d="M2 21h20" />
    </svg>
  );
}

/** Tithes — a tenth, scales. */
export function IconScale(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18" />
      <path d="M5 7h14" />
      <path d="M5 7l-2.5 6a3 3 0 0 0 5 0z" />
      <path d="M19 7l-2.5 6a3 3 0 0 0 5 0z" />
    </svg>
  );
}

/** Tzedakah — a heart with a coin / giving. */
export function IconGive(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />
    </svg>
  );
}

/** Pidyon nefesh — candle / flame. */
export function IconFlame(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3c2.5 3 4 5 4 8a4 4 0 0 1-8 0c0-1.5.6-2.6 1.5-3.7" />
      <path d="M12 21a5 5 0 0 0 5-5" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8 3.2-3.6" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5" />
      <path d="M12 5l-7 7 7 7" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function IconQr(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3M21 14v7h-7" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export const TRACK_ICONS = {
  restitution: IconReturn,
  public_needs: IconCommunity,
  maaser: IconScale,
  tzedakah: IconGive,
  pidyon_nefesh: IconFlame,
  general: IconGive,
  campaign: IconGive,
} as const;
