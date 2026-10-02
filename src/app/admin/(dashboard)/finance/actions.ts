"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/rbac";
import { getPaymentsProvider } from "@/server/payments";
import { recordAudit } from "@/server/audit";

async function assertPermission(permission: "finance.write") {
  const session = await getSession();
  if (!session || !can(session.permissions, permission)) {
    throw new Error("אין הרשאה לביצוע הפעולה");
  }
  return session;
}

export async function refundDonation(formData: FormData): Promise<void> {
  const session = await assertPermission("finance.write");
  const donationId = String(formData.get("donationId") ?? "");
  if (!donationId) return;

  const donation = await prisma.donation.findUnique({ where: { id: donationId } });
  if (!donation || !donation.providerRef || donation.status !== "paid") return;

  const provider = getPaymentsProvider();
  const result = await provider.refund({
    providerRef: donation.providerRef,
    amountAgorot: donation.amount,
    reason: "admin_refund",
  });
  if (!result.ok) return;

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        donationId: donation.id,
        provider: donation.provider ?? "mock",
        providerRef: donation.providerRef,
        type: "refund",
        amount: donation.amount,
        currency: donation.currency,
        status: "succeeded",
        metadata: JSON.stringify({ refundRef: result.refundRef }),
      },
    }),
    prisma.donation.update({
      where: { id: donation.id },
      data: { status: "refunded" },
    }),
  ]);

  await recordAudit({
    actorId: session.sub,
    action: "donation.refund",
    entity: "Donation",
    entityId: donation.id,
    after: { amount: donation.amount, refundRef: result.refundRef },
  });

  revalidatePath(`/admin/finance/${donation.id}`);
  revalidatePath("/admin/finance");
}
