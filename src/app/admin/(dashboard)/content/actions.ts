"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/rbac";
import { recordAudit } from "@/server/audit";

async function assertWrite() {
  const session = await getSession();
  if (!session || !can(session.permissions, "content.write")) throw new Error("אין הרשאה");
  return session;
}

export async function toggleFaqPublished(formData: FormData): Promise<void> {
  const session = await assertWrite();
  const id = String(formData.get("id") ?? "");
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) return;
  await prisma.faq.update({ where: { id }, data: { published: !faq.published } });
  await recordAudit({
    actorId: session.sub,
    action: "faq.toggle",
    entity: "Faq",
    entityId: id,
    before: { published: faq.published },
    after: { published: !faq.published },
  });
  revalidatePath("/admin/content");
  revalidatePath("/faq");
}

export async function toggleArticlePublished(formData: FormData): Promise<void> {
  const session = await assertWrite();
  const id = String(formData.get("id") ?? "");
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;
  const published = !article.published;
  await prisma.article.update({
    where: { id },
    data: { published, publishedAt: published ? article.publishedAt ?? new Date() : article.publishedAt },
  });
  await recordAudit({
    actorId: session.sub,
    action: "article.toggle",
    entity: "Article",
    entityId: id,
    before: { published: article.published },
    after: { published },
  });
  revalidatePath("/admin/content");
}
