/**
 * Money helpers. All amounts are stored as integer agorot (1 ILS = 100).
 * Never use floats for money anywhere in the app.
 */

export const AGOROT_PER_SHEKEL = 100;

export function shekelsToAgorot(shekels: number): number {
  if (!Number.isFinite(shekels)) throw new Error("Invalid amount");
  return Math.round(shekels * AGOROT_PER_SHEKEL);
}

export function agorotToShekels(agorot: number): number {
  return agorot / AGOROT_PER_SHEKEL;
}

/**
 * Formats agorot as a Hebrew-friendly shekel string, e.g. 18000 -> "₪180".
 * Whole shekels render without decimals; otherwise two decimals are shown.
 */
export function formatILS(agorot: number): string {
  const value = agorotToShekels(agorot);
  const hasFraction = Math.round(value * 100) % 100 !== 0;
  const formatted = new Intl.NumberFormat("he-IL", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
  return `₪${formatted}`;
}

/** Parses a user-typed amount (may include commas, ₪, whitespace) into agorot. */
export function parseAmountToAgorot(input: string): number | null {
  const cleaned = input.replace(/[₪,\s]/g, "").trim();
  if (!cleaned) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value <= 0) return null;
  return shekelsToAgorot(value);
}

/**
 * Gematria-style "chai" multiples used for quick amounts. Purely a
 * convenience ordering, not a halachic determination.
 */
export const QUICK_AMOUNTS_AGOROT = [
  5400, 7200, 10100, 18000, 36000, 50000,
];
