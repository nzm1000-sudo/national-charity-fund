"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/rbac";
import { recordAudit } from "@/server/audit";

const STATUSES = ["verified", "strong_basis", "disputed", "provisional", "needs_review"];
const CONFIDENCES = ["high", "medium", "low"];

export async function updateHalachicRule(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || !can(session.permissions, "halacha.write")) {
    throw new Error("אין הרשאה לעריכת כללי הלכה");
  }

  const code = String(formData.get("code") ?? "");
  const publicExplanation = String(formData.get("publicExplanation") ?? "").trim();
  const internalReasoning = String(formData.get("internalReasoning") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const confidence = String(formData.get("confidence") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  if (!code || !publicExplanation) return;
  if (!STATUSES.includes(status) || !CONFIDENCES.includes(confidence)) return;

  const rule = await prisma.halachicRule.findUnique({ where: { code } });
  if (!rule) return;

  const nextVersion = rule.currentVersion + 1;

  await prisma.$transaction([
    prisma.halachicRule.update({
      where: { id: rule.id },
      data: {
        publicExplanation,
        internalReasoning: internalReasoning || null,
        status,
        confidence,
        currentVersion: nextVersion,
        reviewer: session.name,
        lastReviewedAt: status === "verified" || status === "strong_basis" ? new Date() : rule.lastReviewedAt,
      },
    }),
    prisma.halachicRuleVersion.create({
      data: {
        ruleId: rule.id,
        version: nextVersion,
        decision: rule.decision,
        publicExplanation,
        internalReasoning: internalReasoning || null,
        status,
        confidence,
        reason: reason || "עדכון ידני",
        author: session.email,
      },
    }),
  ]);

  await recordAudit({
    actorId: session.sub,
    action: "halacha.update",
    entity: "HalachicRule",
    entityId: rule.id,
    before: { status: rule.status, confidence: rule.confidence, version: rule.currentVersion },
    after: { status, confidence, version: nextVersion, reason },
  });

  revalidatePath(`/admin/halacha/${code}`);
  revalidatePath("/admin/halacha");
}
