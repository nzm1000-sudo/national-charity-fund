import { describe, expect, it } from "vitest";
import { runInNewContext } from "node:vm";
import { getStoredTextSize, isTextSize } from "@/lib/text-size";
import { themeInitScript } from "@/lib/theme-init";

describe("text size", () => {
  it("accepts only supported size steps", () => {
    for (const value of [80, 90, 100, 110, 120, 130, 140]) {
      expect(isTextSize(value)).toBe(true);
    }
    for (const value of [0, 79, 85, 141, 150, NaN, Infinity]) {
      expect(isTextSize(value)).toBe(false);
    }
  });

  it("defaults to normal text size during server rendering", () => {
    expect(getStoredTextSize()).toBe(100);
  });

  it.each([
    ["kn_text_size=140; kn_theme=dark", "1.4", "dark"],
    ["kn_text_size=80", "0.8", "light"],
    ["kn_text_size=999; kn_discreet=1", "1", "light"],
    ["kn_text_size=85", "1", "light"],
  ])("restores valid text size before paint: %s", (cookie, scale, theme) => {
    const attributes: Record<string, string> = {};
    const properties: Record<string, string> = {};
    runInNewContext(themeInitScript, {
      document: {
        cookie,
        documentElement: {
          setAttribute: (name: string, value: string) => { attributes[name] = value; },
          removeAttribute: (name: string) => { delete attributes[name]; },
          style: { setProperty: (name: string, value: string) => { properties[name] = value; } },
        },
      },
    });
    expect(properties["--text-scale"]).toBe(scale);
    expect(attributes["data-theme"]).toBe(theme);
    expect(attributes["data-discreet"]).toBeUndefined();
  });
});