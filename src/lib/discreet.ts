/**
 * Discreet mode (client helpers).
 *
 * When on: no analytics, no marketing cookies, no personalization. The choice
 * is stored in a first-party cookie and honoured on both client and server.
 */
export const DISCREET_COOKIE = "kn_discreet";

export function isDiscreetEnabled(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some((c) => c === `${DISCREET_COOKIE}=1`);
}

export function setDiscreet(on: boolean): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DISCREET_COOKIE}=${on ? "1" : "0"}; path=/; max-age=${
    on ? 60 * 60 * 24 * 365 : 0
  }; samesite=lax`;
  window.dispatchEvent(new Event("discreet-change"));
}
