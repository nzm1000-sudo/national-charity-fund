import { describe, it, expect } from "vitest";
import {
  planAllocation,
  totalPlanned,
  AllocationError,
  type DestinationRule,
} from "@/lib/domain/allocation";

const destinations: DestinationRule[] = [
  { causeId: "c1", allowed: true, priority: 10 },
  { causeId: "c2", allowed: true, priority: 90 },
  { causeId: "c3", allowed: false, priority: 100 },
];

describe("allocation engine", () => {
  it("allocates to an explicitly chosen, allowed cause", () => {
    const planned = planAllocation({
      fundTypeCode: "tzedakah",
      amountAgorot: 18000,
      causeId: "c1",
      destinationRules: destinations,
    });
    expect(planned).toHaveLength(1);
    expect(planned[0].causeId).toBe("c1");
    expect(planned[0].amountAgorot).toBe(18000);
  });

  it("rejects a cause that the fund type may not fund", () => {
    expect(() =>
      planAllocation({
        fundTypeCode: "public_needs",
        amountAgorot: 5000,
        causeId: "c3",
        destinationRules: destinations,
      }),
    ).toThrow(AllocationError);
  });

  it("falls back to the highest-priority allowed destination", () => {
    const planned = planAllocation({
      fundTypeCode: "tzedakah",
      amountAgorot: 10000,
      causeId: null,
      destinationRules: destinations,
    });
    expect(planned[0].causeId).toBe("c2");
  });

  it("parks unassigned when nothing is allowed", () => {
    const planned = planAllocation({
      fundTypeCode: "campaign",
      amountAgorot: 10000,
      causeId: null,
      destinationRules: [],
    });
    expect(planned[0].causeId).toBeNull();
    expect(planned[0].ruleCode).toContain("UNASSIGNED");
  });

  it("never loses a shekel in the plan", () => {
    const planned = planAllocation({
      fundTypeCode: "tzedakah",
      amountAgorot: 12345,
      causeId: null,
      destinationRules: destinations,
    });
    expect(totalPlanned(planned)).toBe(12345);
  });

  it("rejects non-positive amounts", () => {
    expect(() =>
      planAllocation({
        fundTypeCode: "tzedakah",
        amountAgorot: 0,
        causeId: null,
        destinationRules: destinations,
      }),
    ).toThrow(AllocationError);
  });
});
