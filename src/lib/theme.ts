"use client";

/** Theme selection — light · dark (#101512) · amber (#211d2b), as in the app. */

export type Theme = "light" | "dark" | "amber";

export const THEMES: Theme[] = ["light", "dark", "amber"];

export const THEME_COOKIE = "kn_theme";

export const THEME_LABELS: Record<Theme, string> = {
  light: "בהירה",
  dark: "כהה",
  amber: "ענבר",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "amber";
}

export function getStoredTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(/(?:^|;\s*)kn_theme=([a-z]+)/);
  const value = match?.[1];
  return isTheme(value) ? value : "light";
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}

export function setTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=${
    60 * 60 * 24 * 365
  }; samesite=lax`;
  applyTheme(theme);
  window.dispatchEvent(new Event("theme-change"));
}
