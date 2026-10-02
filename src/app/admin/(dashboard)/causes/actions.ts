"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/rbac";
import { recordAudit } from "@/server/audit";

async function assertWrite() {
  const session = await getSession();
  if (!session || !can(session.permissions, "causes.write")) {
    throw new Error("אין הרשאה");
  }
  return session;
}

export async function toggleCauseField(formData: FormData): Promise<void> {
  const session = await assertWrite();
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  if (!id || !["active", "publicVisible"].includes(field)) return;

  const cause = await prisma.cause.findUnique({ where: { id } });
  if (!cause) return;

  const value = !(cause as unknown as Record<string, boolean>)[field];
  await prisma.cause.update({
    where: { id },
    data: { [field]: value },
  });

  await recordAudit({
    actorId: session.sub,
    action: "cause.toggle",
    entity: "Cause",
    entityId: id,
    before: { [field]: !value },
    after: { [field]: value },
  });

  revalidatePath("/admin/causes");
}
