"use client";

/**
 * Discreet mode (client helpers).
 *
 * Privacy behaviour is unchanged: when on, no analytics, no marketing cookies,
 * no personalization — the choice is stored in a first-party cookie and honoured
 * on both client and server. It also (a) switches to the dark theme, (b) stops
 * every animation, and (c) hides the site name from the tab title.
 */
import { applyTheme, getStoredTheme } from "@/lib/theme";

export const DISCREET_COOKIE = "kn_discreet";

const DISCREET_TITLE = "‏";

export function isDiscreetEnabled(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split("; ").some((c) => c === `${DISCREET_COOKIE}=1`);
}

/** Applies the appearance side of discreet mode (theme, motion, tab title). */
export function applyDiscreetAppearance(on: boolean): void {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (on) {
    if (!el.dataset.discreet) {
      el.dataset.originalTitle = document.title;
    }
    el.setAttribute("data-discreet", "1");
    applyTheme("dark");
    document.title = DISCREET_TITLE;
  } else {
    el.removeAttribute("data-discreet");
    applyTheme(getStoredTheme());
    if (el.dataset.originalTitle) document.title = el.dataset.originalTitle;
  }
}

export function setDiscreet(on: boolean): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DISCREET_COOKIE}=${on ? "1" : "0"}; path=/; max-age=${
    on ? 60 * 60 * 24 * 365 : 0
  }; samesite=lax`;
  applyDiscreetAppearance(on);
  window.dispatchEvent(new Event("discreet-change"));
}
