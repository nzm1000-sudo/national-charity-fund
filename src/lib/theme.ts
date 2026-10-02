"use client";

/** Theme selection: light or dark. */

export type Theme = "light" | "dark";

export const THEMES: Theme[] = ["light", "dark"];

export const THEME_COOKIE = "kn_theme";

export const THEME_LABELS: Record<Theme, string> = {
  light: "בהירה",
  dark: "כהה",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
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
