import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/rbac";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toggleArticlePublished, toggleFaqPublished } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const session = await requirePermission("content.read");
  const editable = can(session.permissions, "content.write");

  const [faqs, articles, pages] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.article.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.page.findMany({ orderBy: { slug: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">תוכן</h1>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">שאלות נפוצות</h2>
          <ul className="mt-3 divide-y divide-border">
            {faqs.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span className="min-w-0 truncate">{f.question}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <Badge tone={f.published ? "success" : "neutral"}>{f.published ? "מפורסם" : "מוסתר"}</Badge>
                  {editable && (
                    <form action={toggleFaqPublished}>
                      <input type="hidden" name="id" value={f.id} />
                      <Button size="sm" variant="ghost" type="submit">החלף</Button>
                    </form>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">מאמרים</h2>
          <ul className="mt-3 divide-y divide-border">
            {articles.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 py-2.5 text-sm">
                <span className="min-w-0 truncate">{a.title}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <Badge tone={a.published ? "success" : "neutral"}>{a.published ? "מפורסם" : "טיוטה"}</Badge>
                  {editable && (
                    <form action={toggleArticlePublished}>
                      <input type="hidden" name="id" value={a.id} />
                      <Button size="sm" variant="ghost" type="submit">החלף</Button>
                    </form>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">עמודים</h2>
          {pages.length === 0 ? (
            <p className="mt-3 text-sm text-muted">אין עמודים דינמיים מוגדרים.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border">
              {pages.map((p) => (
                <li key={p.id} className="py-2.5 text-sm num">{p.slug}</li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
