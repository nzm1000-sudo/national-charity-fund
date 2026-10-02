import { describe, it, expect } from "vitest";
import { FUND_TYPES, PRIMARY_TRACKS } from "@/lib/domain/fund-types";

describe("fund types", () => {
  it("starts suggested donation amounts at 54 shekels in every fund", () => {
    for (const fund of FUND_TYPES) {
      expect(fund.suggestedAmounts[0]).toBe(5400);
      expect(fund.suggestedAmounts.every(amount => amount >= 5400)).toBe(true);
    }
  });

  it("has unique codes", () => {
    const codes = FUND_TYPES.map((f) => f.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("has internal routes for every fund type", () => {
    for (const f of FUND_TYPES) {
      expect(f.route.startsWith("/")).toBe(true);
    }
  });

  it("includes a distinct public_needs category", () => {
    const publicNeeds = FUND_TYPES.find((f) => f.code === "public_needs");
    expect(publicNeeds?.halachicClassification).toBe("tzorchei_rabim");
    expect(publicNeeds?.route).toBe("/tzrachei-rabim");
  });

  it("exposes four primary tracks", () => {
    expect(PRIMARY_TRACKS).toEqual([
      "restitution",
      "maaser",
      "tzedakah",
      "pidyon_nefesh",
    ]);
  });
});
