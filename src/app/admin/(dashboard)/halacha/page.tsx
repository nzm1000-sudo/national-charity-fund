import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guard";
import { Card, CardBody, Badge } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  verified: "מאומת",
  strong_basis: "מבוסס",
  disputed: "במחלוקת",
  provisional: "זמני",
  needs_review: "ממתין לעיון",
};

export default async function AdminHalachaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("halacha.read");
  const sp = await searchParams;
  const filter = typeof sp.filter === "string" ? sp.filter : "all";

  const rules = await prisma.halachicRule.findMany({
    orderBy: [{ topic: "asc" }, { code: "asc" }],
    include: { sources: true },
  });

  const shown =
    filter === "unreviewed"
      ? rules.filter((r) => r.status === "needs_review" || r.status === "provisional")
      : rules;

  const pending = rules.filter((r) => r.status === "needs_review" || r.status === "provisional").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-3xl">מנוע ההלכה</h1>
        <p className="text-sm text-muted">{pending} כללים ממתינים לעיון</p>
      </div>

      <div className="flex gap-2 text-sm">
        <Link
          href="/admin/halacha"
          className={filter === "all" ? "font-medium text-primary" : "text-muted hover:text-primary"}
        >
          הכל
        </Link>
        <Link
          href="/admin/halacha?filter=unreviewed"
          className={filter === "unreviewed" ? "font-medium text-primary" : "text-muted hover:text-primary"}
        >
          ממתינים לעיון
        </Link>
      </div>

      <div className="space-y-3">
        {shown.map((r) => (
          <Card key={r.id}>
            <CardBody className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="num text-xs text-muted">{r.code}</span>
                  <Badge tone={r.status === "disputed" ? "gold" : r.status === "verified" || r.status === "strong_basis" ? "primary" : "neutral"}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </Badge>
                  <Badge tone="neutral">ביטחון: {r.confidence}</Badge>
                  <Badge tone="neutral">{r.sources.length} מקורות</Badge>
                </div>
                <h2 className="mt-2 font-medium">
                  {r.topic}
                  {r.subtopic ? ` · ${r.subtopic}` : ""}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{r.publicExplanation}</p>
              </div>
              <Link
                href={`/admin/halacha/${r.code}`}
                className="shrink-0 text-sm font-medium text-primary"
              >
                עריכה
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
