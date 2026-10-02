/**
 * Halachic Rules Engine (pure).
 *
 * A rule is data, not hardcoded logic: it has a condition, a decision, sources,
 * a confidence and a review status. The app asks the engine a question and gets
 * back the matching rules in priority order.
 *
 * IMPORTANT (see docs/HALACHA.md): sources are only ever the ones actually
 * researched. Where a value is a system application rather than a quotation it
 * lives in `internalReasoning`, never in a `quote`.
 */

export type HalachicStatus =
  | "verified"
  | "strong_basis"
  | "disputed"
  | "provisional"
  | "needs_review";

export type HalachicConfidence = "high" | "medium" | "low";

export interface HalachicSourceRef {
  code: string;
  /** How this source relates to the rule. */
  role: "primary" | "supporting" | "dissent";
  /** Optional short citation label (from the researched source record). */
  citation?: string;
}

export interface HalachicCondition {
  /** Restrict to a fund type. */
  fundType?: string;
  /** Exact-match answers on the question engine (e.g. { ownerKnown: "no" }). */
  answers?: Record<string, string>;
  /** Any-of match on free tags attached to a question result. */
  tagsAny?: string[];
}

export interface HalachicDecision {
  /** Stable route key the UI maps to an action. */
  route:
    | "return_direct"
    | "public_needs"
    | "tzedakah"
    | "pidyon_nefesh"
    | "maaser"
    | "consult"
    | "voluntary";
  /** Optional suggested fund type for the flow. */
  fundType?: string;
  /** Short internal note for admins/devs. */
  note?: string;
}

export interface HalachicRule {
  code: string;
  topic: string;
  subtopic?: string;
  condition: HalachicCondition;
  decision: HalachicDecision;
  /** Shown to the user (plain Hebrew, 1–3 sentences). */
  publicExplanation: string;
  /** Never shown to users. System reasoning / what still needs review. */
  internalReasoning?: string;
  confidence: HalachicConfidence;
  status: HalachicStatus;
  priority: number;
  sources: HalachicSourceRef[];
}

export interface HalachicQuery {
  fundType?: string;
  answers?: Record<string, string>;
  tags?: string[];
}

export interface HalachicMatch {
  rule: HalachicRule;
  score: number;
}

/** Does a single rule match the query? (all specified condition parts must hold) */
export function ruleMatches(rule: HalachicRule, query: HalachicQuery): boolean {
  const c = rule.condition;

  if (c.fundType && c.fundType !== query.fundType) return false;

  if (c.answers) {
    for (const [k, v] of Object.entries(c.answers)) {
      if ((query.answers ?? {})[k] !== v) return false;
    }
  }

  if (c.tagsAny && c.tagsAny.length > 0) {
    const tags = query.tags ?? [];
    if (!c.tagsAny.some((t) => tags.includes(t))) return false;
  }

  return true;
}

/** Specificity = number of constrained dimensions; used to rank matches. */
function specificity(rule: HalachicRule): number {
  const c = rule.condition;
  let n = 0;
  if (c.fundType) n += 2;
  if (c.answers) n += Object.keys(c.answers).length * 2;
  if (c.tagsAny) n += 1;
  return n;
}

const STATUS_WEIGHT: Record<HalachicStatus, number> = {
  verified: 5,
  strong_basis: 4,
  disputed: 3,
  provisional: 2,
  needs_review: 1,
};

/**
 * Returns matching rules, best first. Rules that are still `needs_review`
 * are returned but ranked lower and flagged so the UI can present them as a
 * reasonable option rather than a definitive ruling.
 */
export function evaluateRules(
  rules: HalachicRule[],
  query: HalachicQuery,
): HalachicMatch[] {
  return rules
    .filter((r) => ruleMatches(r, query))
    .map((rule) => ({
      rule,
      score:
        specificity(rule) * 10 +
        STATUS_WEIGHT[rule.status] +
        (rule.priority ?? 100) / 1000,
    }))
    .sort((a, b) => b.score - a.score);
}

/** The single best rule for a query, if any. */
export function resolveRule(
  rules: HalachicRule[],
  query: HalachicQuery,
): HalachicRule | undefined {
  return evaluateRules(rules, query)[0]?.rule;
}

/** Rules that are not yet fully reviewed — surfaced to admins. */
export function unreviewedRules(rules: HalachicRule[]): HalachicRule[] {
  return rules.filter(
    (r) => r.status === "needs_review" || r.status === "provisional",
  );
}
