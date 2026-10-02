import type { FundContext } from "@/server/funds";
import type { DonationFormFund } from "@/components/flows/donation-form";

/** Maps a full fund context to the minimal shape the client form needs. */
export function toFormFund(ctx: FundContext): DonationFormFund {
  return {
    code: ctx.code,
    nameHe: ctx.nameHe,
    minAmountAgorot: ctx.minAmountAgorot,
    suggestedAmounts: ctx.suggestedAmounts,
    anonymousAllowed: ctx.anonymousAllowed,
    receiptRequired: ctx.receiptRequired,
    destinations: ctx.destinations.map((d) => ({
      causeId: d.causeId,
      nameHe: d.nameHe,
      slug: d.slug,
    })),
  };
}
