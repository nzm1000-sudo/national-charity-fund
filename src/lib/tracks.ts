/**
 * Presentation map: fund-type code → the seal hue it wears. Kept here (not in
 * lib/domain) so the domain stays untouched.
 */
export const TRACK_COLOR: Record<string, string> = {
  restitution: "var(--color-track-restitution)",
  public_needs: "var(--color-track-public)",
  maaser: "var(--color-track-maaser)",
  tzedakah: "var(--color-track-tzedakah)",
  pidyon_nefesh: "var(--color-track-pidyon)",
  general: "var(--color-track-general)",
  campaign: "var(--color-track-general)",
};

export function trackColor(code: string): string {
  return TRACK_COLOR[code] ?? "var(--color-accent)";
}
