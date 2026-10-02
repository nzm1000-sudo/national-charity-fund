import { prisma } from "@/lib/prisma";
import { FUND_TYPES } from "@/lib/domain/fund-types";
import { planAllocation, AllocationError } from "@/lib/domain/allocation";
import { donationPublicId } from "@/lib/ids";
import type { CreateDonationInput } from "@/lib/validation";
import { getFundContext, toDestinationRules } from "@/server/funds";
import { getPaymentsProvider } from "@/server/payments";
import { recordAudit } from "@/server/audit";
import { track } from "@/server/analytics";
import { env } from "@/lib/env";

export class DonationError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "DonationError";
  }
}

export interface CreateDonationResult {
  publicId: string;
  status: string;
  redirectUrl?: string;
}

/**
 * Creates a pending donation, plans its allocation, and opens a payment intent.
 * No card data ever reaches this layer — only a provider reference.
 */
export async function createDonation(
  input: CreateDonationInput,
  headers: Headers,
): Promise<CreateDonationResult> {
  const def = FUND_TYPES.find((f) => f.code === input.fundType);
  if (!def) throw new DonationError("unknown_fund", "סוג הקופה אינו מוכר");

  if (input.amountAgorot < def.minAmountAgorot) {
    throw new DonationError(
      "amount_too_low",
      `הסכום המינימלי למסלול זה הוא ${def.minAmountAgorot / 100} ₪`,
    );
  }

  const fund = await getFundContext(input.fundType);
  if (!fund) throw new DonationError("unknown_fund", "סוג הקופה אינו מוכר");

  // Plan allocation (throws if the chosen cause is not permitted for this fund).
  let planned;
  try {
    planned = planAllocation({
      fundTypeCode: input.fundType,
      amountAgorot: input.amountAgorot,
      causeId: input.causeId ?? null,
      destinationRules: toDestinationRules(fund.destinations),
    });
  } catch (err) {
    if (err instanceof AllocationError) {
      throw new DonationError("allocation", err.message);
    }
    throw err;
  }

  const publicId = donationPublicId();
  const anonymous = input.anonymous || !input.donorName;

  const metadata: Record<string, unknown> = {};
  if (input.restitution) metadata.restitution = input.restitution;
  if (input.pidyon) metadata.pidyon = input.pidyon;

  const donation = await prisma.donation.create({
    data: {
      publicId,
      fundTypeCode: input.fundType,
      causeId: input.causeId ?? null,
      campaignId: input.campaignId ?? null,
      qrId: input.qrId ?? null,
      amount: input.amountAgorot,
      currency: "ILS",
      status: "pending",
      donorName: anonymous ? null : input.donorName || null,
      donorEmail: input.donorEmail || null,
      donorPhone: input.donorPhone || null,
      anonymous,
      discreetMode: input.diligentDiscretion,
      designation: input.designation || null,
      dedication: input.dedication || null,
      source: input.source || null,
      provider: env.PAYMENTS_PROVIDER,
      metadata: JSON.stringify(metadata),
      allocations: {
        create: planned.map((p) => ({
          fundTypeCode: p.fundTypeCode,
          causeId: p.causeId,
          amount: p.amountAgorot,
          currency: "ILS",
          ruleCode: p.ruleCode,
          rationale: p.rationale,
        })),
      },
    },
  });

  // Open a payment intent with the configured provider.
  const provider = getPaymentsProvider();
  const intent = await provider.createIntent({
    donationPublicId: publicId,
    amountAgorot: input.amountAgorot,
    currency: "ILS",
    description: `${def.nameHe} · הקופה הלאומית`,
    returnUrl: `${env.APP_URL}/donation/${publicId}`,
  });

  await prisma.donation.update({
    where: { id: donation.id },
    data: { status: intent.status, providerRef: intent.providerRef },
  });

  await recordAudit({
    action: "donation.create",
    entity: "Donation",
    entityId: donation.id,
    after: { publicId, amount: input.amountAgorot, fundType: input.fundType },
    ip: headers.get("x-forwarded-for"),
    userAgent: headers.get("user-agent"),
  });

  await track({
    type: "donation_initiated",
    fundTypeCode: input.fundType,
    causeId: input.causeId ?? undefined,
    discreet: input.diligentDiscretion,
    headers,
  });

  return { publicId, status: intent.status, redirectUrl: intent.redirectUrl };
}

export async function getDonationByPublicId(publicId: string) {
  return prisma.donation.findUnique({
    where: { publicId },
    include: {
      fundType: true,
      cause: true,
      receipt: true,
      allocations: { include: { cause: true } },
    },
  });
}

function receiptNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RC-${year}-${rand}`;
}

/**
 * Marks a donation paid (from a verified webhook) and issues a receipt when the
 * fund type requires one. Idempotent.
 */
export async function completeDonation(
  providerRef: string,
  rawStatus?: string,
): Promise<{ ok: boolean; publicId?: string }> {
  const donation = await prisma.donation.findFirst({
    where: { providerRef },
    include: { fundType: true, receipt: true },
  });
  if (!donation) return { ok: false };

  if (donation.status === "paid") {
    return { ok: true, publicId: donation.publicId }; // idempotent
  }

  await prisma.$transaction(async (tx) => {
    await tx.donation.update({
      where: { id: donation.id },
      data: { status: "paid", paidAt: new Date() },
    });

    await tx.transaction.create({
      data: {
        donationId: donation.id,
        provider: donation.provider ?? env.PAYMENTS_PROVIDER,
        providerRef,
        type: "charge",
        amount: donation.amount,
        currency: donation.currency,
        status: "succeeded",
        rawStatus: rawStatus ?? null,
      },
    });

    if (donation.fundType.receiptRequired && !donation.receipt) {
      await tx.receipt.create({
        data: {
          number: receiptNumber(),
          donationId: donation.id,
          amount: donation.amount,
          currency: donation.currency,
          donorName: donation.anonymous ? null : donation.donorName,
          status: "issued",
        },
      });
    }
  });

  await recordAudit({
    action: "donation.paid",
    entity: "Donation",
    entityId: donation.id,
    after: { publicId: donation.publicId, amount: donation.amount },
  });

  return { ok: true, publicId: donation.publicId };
}

export async function failDonation(providerRef: string): Promise<void> {
  const donation = await prisma.donation.findFirst({ where: { providerRef } });
  if (!donation || donation.status === "paid") return;
  await prisma.donation.update({
    where: { id: donation.id },
    data: { status: "failed" },
  });
  await prisma.transaction.create({
    data: {
      donationId: donation.id,
      provider: donation.provider ?? env.PAYMENTS_PROVIDER,
      providerRef,
      type: "charge",
      amount: donation.amount,
      currency: donation.currency,
      status: "failed",
    },
  });
}
