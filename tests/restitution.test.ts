import { describe, it, expect } from "vitest";
import { classifyRestitution } from "@/lib/domain/restitution";

describe("restitution engine", () => {
  it("returns direct when owner known and reachable", () => {
    const o = classifyRestitution({ ownerKnown: "yes", reachable: "yes" });
    expect(o.route).toBe("return_direct");
    expect(o.needsMoreInfo).toBe(false);
  });

  it("asks for reachability before deciding when owner is known", () => {
    const o = classifyRestitution({ ownerKnown: "yes" });
    expect(o.needsMoreInfo).toBe(true);
    expect(o.nextQuestion).toBe("reachable");
  });

  it("routes untraceable owner to public needs", () => {
    const o = classifyRestitution({ ownerKnown: "yes", reachable: "no" });
    expect(o.route).toBe("public_needs");
    expect(o.fundType).toBe("public_needs");
  });

  it("routes unknown owner to public needs", () => {
    const o = classifyRestitution({ ownerKnown: "no", manyPeople: false });
    expect(o.route).toBe("public_needs");
  });

  it("marks pure doubt as voluntary", () => {
    const o = classifyRestitution({ ownerKnown: "unsure" });
    expect(o.route).toBe("voluntary");
  });
});
