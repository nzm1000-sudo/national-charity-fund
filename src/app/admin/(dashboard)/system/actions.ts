"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/rbac";
import { recordAudit } from "@/server/audit";

export async function toggleAdminActive(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || !can(session.permissions, "system.write")) throw new Error("אין הרשאה");
  const id = String(formData.get("id") ?? "");
  if (id === session.sub) return; // never deactivate yourself

  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) return;
  await prisma.adminUser.update({ where: { id }, data: { active: !user.active } });
  await recordAudit({
    actorId: session.sub,
    action: "adminUser.toggle",
    entity: "AdminUser",
    entityId: id,
    before: { active: user.active },
    after: { active: !user.active },
  });
  revalidatePath("/admin/system");
}
