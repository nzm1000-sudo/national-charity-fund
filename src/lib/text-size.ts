"use client";

export const TEXT_SIZE_MIN = 80;
export const TEXT_SIZE_MAX = 140;
export const TEXT_SIZE_STEP = 10;
export const TEXT_SIZE_DEFAULT = 100;

export function isTextSize(value: number): boolean {
  return Number.isInteger(value) && value >= TEXT_SIZE_MIN && value <= TEXT_SIZE_MAX && value % TEXT_SIZE_STEP === 0;
}

export function getStoredTextSize(): number {
  if (typeof document === "undefined") return TEXT_SIZE_DEFAULT;
  const match = document.cookie.match(/(?:^|;\s*)kn_text_size=(\d+)(?:;|$)/);
  const value = Number(match?.[1]);
  return isTextSize(value) ? value : TEXT_SIZE_DEFAULT;
}

export function setTextSize(value: number): void {
  if (typeof document === "undefined" || !isTextSize(value)) return;
  document.cookie = `kn_text_size=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  document.documentElement.style.setProperty("--text-scale", String(value / 100));
  window.dispatchEvent(new Event("text-size-change"));
}

export function subscribeTextSize(callback: () => void): () => void {
  window.addEventListener("text-size-change", callback);
  return () => window.removeEventListener("text-size-change", callback);
}