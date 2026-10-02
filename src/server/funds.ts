import { prisma } from "@/lib/prisma";
import { FUND_TYPES, type FundTypeDef } from "@/lib/domain/fund-types";
import type { DestinationRule } from "@/lib/domain/allocation";

export interface PublicFund {
  code: string;
  nameHe: string;
  taglineHe: string;
  descriptionHe: string;
  route: string;
  minAmountAgorot: number;
  suggestedAmounts: number[];
  anonymousAllowed: boolean;
  receiptRequired: boolean;
}

function toPublic(def: FundTypeDef): PublicFund {
  return {
    code: def.code,
    nameHe: def.nameHe,
    taglineHe: def.taglineHe,
    descriptionHe: def.descriptionHe,
    route: def.route,
    minAmountAgorot: def.minAmountAgorot,
    suggestedAmounts: def.suggestedAmounts,
    anonymousAllowed: def.anonymousAllowed,
    receiptRequired: def.receiptRequired,
  };
}

export function publicFunds(): PublicFund[] {
  return FUND_TYPES.filter((f) => f.code !== "general" && f.code !== "campaign").map(toPublic);
}

export interface FundContext extends PublicFund {
  /** Causes this fund may be allocated to, best-first. */
  destinations: Array<DestinationRule & { nameHe: string; summary?: string | null; slug: string }>;
}

/** Everything a donation form needs for a given fund type. */
export async function getFundContext(code: string): Promise<FundContext | null> {
  const def = FUND_TYPES.find((f) => f.code === code);
  if (!def) return null;

  const rows = await prisma.fundTypeDestination.findMany({
    where: { fundTypeCode: code, allowed: true, cause: { active: true, publicVisible: true } },
    include: { cause: true },
    orderBy: { priority: "desc" },
  });

  return {
    ...toPublic(def),
    destinations: rows.map((r) => ({
      causeId: r.causeId,
      causeSlug: r.cause.slug,
      allowed: r.allowed,
      priority: r.priority,
      nameHe: r.cause.nameHe,
      summary: r.cause.summary,
      slug: r.cause.slug,
    })),
  };
}

export async function listPublicCauses() {
  return prisma.cause.findMany({
    where: { active: true, publicVisible: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getCauseBySlug(slug: string) {
  return prisma.cause.findFirst({
    where: { slug, active: true, publicVisible: true },
  });
}

/** Destination rules for the allocator (pure-friendly shape). */
export function toDestinationRules(
  destinations: FundContext["destinations"],
): DestinationRule[] {
  return destinations.map((d) => ({
    causeId: d.causeId,
    causeSlug: d.slug,
    allowed: d.allowed,
    priority: d.priority,
  }));
}
