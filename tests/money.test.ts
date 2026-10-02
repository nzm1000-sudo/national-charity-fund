import { describe, it, expect } from "vitest";
import {
  shekelsToAgorot,
  agorotToShekels,
  formatILS,
  parseAmountToAgorot,
} from "@/lib/money";

describe("money", () => {
  it("converts shekels to agorot without float drift", () => {
    expect(shekelsToAgorot(18)).toBe(1800);
    expect(shekelsToAgorot(0.1)).toBe(10);
    expect(shekelsToAgorot(19.99)).toBe(1999);
  });

  it("round-trips", () => {
    expect(agorotToShekels(shekelsToAgorot(123.45))).toBeCloseTo(123.45);
  });

  it("formats whole and fractional amounts", () => {
    expect(formatILS(18000)).toBe("₪180");
    expect(formatILS(18550)).toContain("185.5");
  });

  it("parses user input including symbols and separators", () => {
    expect(parseAmountToAgorot("₪1,800")).toBe(180000);
    expect(parseAmountToAgorot(" 18 ")).toBe(1800);
    expect(parseAmountToAgorot("")).toBeNull();
    expect(parseAmountToAgorot("abc")).toBeNull();
    expect(parseAmountToAgorot("0")).toBeNull();
    expect(parseAmountToAgorot("-5")).toBeNull();
  });
});
