import { describe, it, expect } from "vitest";
import { classifyRestitution } from "@/lib/domain/restitution";
import { publicCopy } from "@/components/ui/public-copy";

describe("restitution engine", () => {
  it("returns direct when owner known and reachable", () => {
    const o = classifyRestitution({ ownerKnown: "yes", reachable: "yes" });
    expect(o.route).toBe("return_direct");
    expect(o.needsMoreInfo).toBe(false);
    expect(publicCopy(o.explanationHe)).toBe(
      "כאשר בעל הממון ידוע וניתן להגיע אליו, אין לתת את הכסף למטרה אחרת, צריך להשיב לו את הממון עצמו. אם תרצה, נעזור לך לנסח פנייה מכבדת בצנעה וסתר.",
    );
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
