import { describe, it, expect } from "vitest";
import {
  evaluateRules,
  resolveRule,
  unreviewedRules,
  type HalachicRule,
} from "@/lib/domain/halacha";
import { HALACHIC_RULES } from "@/lib/domain/halachic-rules-data";

describe("halachic rules engine", () => {
  it("resolves direct return when owner is known and reachable", () => {
    const rule = resolveRule(HALACHIC_RULES, {
      fundType: "restitution",
      answers: { ownerKnown: "yes", reachable: "yes" },
    });
    expect(rule?.code).toBe("HR-REST-001");
    expect(rule?.decision.route).toBe("return_direct");
  });

  it("routes unknown owner to public needs", () => {
    const rule = resolveRule(HALACHIC_RULES, {
      fundType: "restitution",
      answers: { ownerKnown: "no", manyPeople: "false" },
    });
    expect(rule?.decision.route).toBe("public_needs");
    expect(rule?.status).toBe("strong_basis");
  });

  it("marks untraceable-owner case as disputed", () => {
    const rule = resolveRule(HALACHIC_RULES, {
      fundType: "restitution",
      answers: { ownerKnown: "yes", reachable: "no" },
    });
    expect(rule?.code).toBe("HR-REST-003");
    expect(rule?.status).toBe("disputed");
  });

  it("never fabricates: every rule has at least one source", () => {
    for (const r of HALACHIC_RULES) {
      expect(r.sources.length, `${r.code} has no sources`).toBeGreaterThan(0);
    }
  });

  it("keeps unreviewed rules flagged", () => {
    const flagged = unreviewedRules(HALACHIC_RULES).map((r) => r.code);
    expect(flagged).toContain("HR-REST-006");
  });

  it("prefers more specific matches", () => {
    const generic: HalachicRule = {
      code: "GEN",
      topic: "t",
      condition: { fundType: "restitution" },
      decision: { route: "public_needs" },
      publicExplanation: "",
      confidence: "low",
      status: "needs_review",
      priority: 100,
      sources: [],
    };
    const matches = evaluateRules([generic, ...HALACHIC_RULES], {
      fundType: "restitution",
      answers: { ownerKnown: "yes", reachable: "yes" },
    });
    expect(matches[0].rule.code).toBe("HR-REST-001");
  });
});
