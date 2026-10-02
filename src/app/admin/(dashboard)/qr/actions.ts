"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/rbac";
import { shortCode } from "@/lib/ids";
import { recordAudit } from "@/server/audit";

async function assertWrite() {
  const session = await getSession();
  if (!session || !can(session.permissions, "qr.write")) throw new Error("אין הרשאה");
  return session;
}

export async function createQrCode(formData: FormData): Promise<void> {
  const session = await assertWrite();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const destination = String(formData.get("destination") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug) || !destination) return;
  if (!destination.startsWith("/")) return;

  const existing = await prisma.qrCode.findUnique({ where: { slug } });
  if (existing) return;

  const qr = await prisma.qrCode.create({
    data: {
      code: `qr_${shortCode(6)}`,
      slug,
      destination,
      source: source || null,
      createdBy: session.email,
    },
  });

  await recordAudit({
    actorId: session.sub,
    action: "qr.create",
    entity: "QrCode",
    entityId: qr.id,
    after: { slug, destination },
  });

  revalidatePath("/admin/qr");
}

export async function toggleQrCode(formData: FormData): Promise<void> {
  const session = await assertWrite();
  const id = String(formData.get("id") ?? "");
  const qr = await prisma.qrCode.findUnique({ where: { id } });
  if (!qr) return;

  await prisma.qrCode.update({ where: { id }, data: { active: !qr.active } });
  await recordAudit({
    actorId: session.sub,
    action: "qr.toggle",
    entity: "QrCode",
    entityId: id,
    before: { active: qr.active },
    after: { active: !qr.active },
  });
  revalidatePath("/admin/qr");
}
