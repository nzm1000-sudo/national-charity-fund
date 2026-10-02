/**
 * Allocation engine (pure).
 *
 * Every donation must be bound to a fund type and produce an Allocation record.
 * This module decides *where* an amount goes, given the fund type's destination
 * rules. It never moves money between fund categories without an explicit rule.
 */

export interface DestinationRule {
  causeId: string;
  causeSlug?: string;
  allowed: boolean;
  priority: number;
}

export interface AllocationInput {
  fundTypeCode: string;
  amountAgorot: number;
  causeId?: string | null;
  destinationRules: DestinationRule[];
}

export interface PlannedAllocation {
  fundTypeCode: string;
  causeId: string | null;
  amountAgorot: number;
  ruleCode: string | null;
  rationale: string;
}

/** Thrown when a donation targets a cause the fund type may not fund. */
export class AllocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AllocationError";
  }
}

/**
 * Plans the allocation of a single donation.
 *
 * - An explicit, allowed cause receives the full amount.
 * - Otherwise the highest-priority allowed destination receives it.
 * - With no allowed destination, the amount is parked unassigned (causeId null)
 *   for an admin to allocate explicitly via a FundRule. It is never silently
 *   redirected to a different fund type.
 */
export function planAllocation(input: AllocationInput): PlannedAllocation[] {
  const { fundTypeCode, amountAgorot, causeId, destinationRules } = input;

  if (amountAgorot <= 0) {
    throw new AllocationError("סכום הקצאה חייב להיות גדול מאפס");
  }

  const allowed = destinationRules.filter((d) => d.allowed);

  if (causeId) {
    const match = allowed.find((d) => d.causeId === causeId);
    if (!match) {
      throw new AllocationError(
        "היעד שנבחר אינו מותר עבור סוג הקופה הזה",
      );
    }
    return [
      {
        fundTypeCode,
        causeId,
        amountAgorot,
        ruleCode: `ALLOC-${fundTypeCode}-EXPLICIT`,
        rationale: "היעד נבחר במפורש על ידי התורם",
      },
    ];
  }

  if (allowed.length > 0) {
    const best = [...allowed].sort((a, b) => b.priority - a.priority)[0];
    return [
      {
        fundTypeCode,
        causeId: best.causeId,
        amountAgorot,
        ruleCode: `ALLOC-${fundTypeCode}-PRIORITY`,
        rationale: "הוקצה ליעד בעל העדיפות הגבוהה ביותר עבור סוג קופה זה",
      },
    ];
  }

  return [
    {
      fundTypeCode,
      causeId: null,
      amountAgorot,
      ruleCode: `ALLOC-${fundTypeCode}-UNASSIGNED`,
      rationale:
        "אין יעד מותר מוגדר — הכסף מוקצה לקופה וממתין להקצאה מפורשת של מנהל",
    },
  ];
}

/** Sums planned allocations; used as a safety invariant in tests. */
export function totalPlanned(planned: PlannedAllocation[]): number {
  return planned.reduce((sum, p) => sum + p.amountAgorot, 0);
}
