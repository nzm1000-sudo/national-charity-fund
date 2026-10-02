import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guard";
import { can } from "@/lib/rbac";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { updateHalachicRule } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminHalachaRulePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const session = await requirePermission("halacha.read");
  const { code } = await params;

  const rule = await prisma.halachicRule.findUnique({
    where: { code },
    include: {
      sources: { include: { source: true } },
      versions: { orderBy: { version: "desc" } },
      fundRules: true,
    },
  });
  if (!rule) notFound();

  const editable = can(session.permissions, "halacha.write");
  const condition = JSON.parse(rule.condition || "{}");
  const decision = JSON.parse(rule.decision || "{}");

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted">
        <Link href="/admin/halacha" className="hover:text-primary">
          מנוע ההלכה
        </Link>
        <span aria-hidden className="px-2">/</span>
        <span className="num text-ink-soft">{rule.code}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2">
        <h1 className="font-display text-2xl">{rule.topic}</h1>
        <Badge tone="neutral">גרסה {rule.currentVersion}</Badge>
        <Badge tone={rule.status === "disputed" ? "gold" : "primary"}>{rule.status}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-display text-lg">מקורות</h2>
            <ul className="mt-3 space-y-4 text-sm">
              {rule.sources.map((s) => (
                <li key={s.id}>
                  <p className="font-medium">
                    {s.source.title}
                    {s.source.work ? ` — ${s.source.work}` : ""}
                    {s.source.citation ? `, ${s.source.citation}` : ""}
                    <span className="ms-2 text-xs text-muted">({s.role})</span>
                  </p>
                  {s.source.quote && (
                    <p className="mt-1 border-s-2 border-gold/60 ps-3 italic">{s.source.quote}</p>
                  )}
                  {s.source.paraphrase && (
                    <p className="mt-1 text-muted">{s.source.paraphrase}</p>
                  )}
                  <p className="mt-1 num text-xs text-muted">
                    {s.source.code} · {s.source.sourceType} · {s.source.tradition}
                  </p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-display text-lg">תנאי והחלטה</h2>
            <pre className="mt-3 overflow-x-auto rounded-md bg-surface-2 p-3 text-xs" dir="ltr">
              {JSON.stringify(condition, null, 2)}
            </pre>
            <pre className="mt-3 overflow-x-auto rounded-md bg-surface-2 p-3 text-xs" dir="ltr">
              {JSON.stringify(decision, null, 2)}
            </pre>
            {rule.fundRules.length > 0 && (
              <p className="mt-3 text-xs text-muted">
                כללי הקצאה מקושרים: {rule.fundRules.map((f) => f.code).join(", ")}
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {editable ? (
        <Card>
          <CardBody>
            <h2 className="font-display text-lg">עריכה</h2>
            <p className="mt-1 text-sm text-muted">
              כל שמירה יוצרת גרסה חדשה ונשמרת בהיסטוריה. אין מחיקת גרסאות קודמות.
            </p>
            <form action={updateHalachicRule} className="mt-4 space-y-4">
              <input type="hidden" name="code" value={rule.code} />
              <Field label="הסבר למשתמש" htmlFor="publicExplanation" required>
                <Textarea id="publicExplanation" name="publicExplanation" defaultValue={rule.publicExplanation} required maxLength={1000} />
              </Field>
              <Field label="נימוק פנימי (לא מוצג למשתמש)" htmlFor="internalReasoning">
                <Textarea id="internalReasoning" name="internalReasoning" defaultValue={rule.internalReasoning ?? ""} maxLength={2000} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="סטטוס" htmlFor="status">
                  <select
                    id="status"
                    name="status"
                    defaultValue={rule.status}
                    className="mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3.5 py-3 text-[15px]"
                  >
                    {["verified", "strong_basis", "disputed", "provisional", "needs_review"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="ביטחון" htmlFor="confidence">
                  <select
                    id="confidence"
                    name="confidence"
                    defaultValue={rule.confidence}
                    className="mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3.5 py-3 text-[15px]"
                  >
                    {["high", "medium", "low"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="סיבת השינוי" htmlFor="reason">
                  <Input id="reason" name="reason" placeholder="למשל: עיון עם פוסק" />
                </Field>
              </div>
              <Button type="submit">שמירת גרסה חדשה</Button>
            </form>
          </CardBody>
        </Card>
      ) : (
        <p className="text-sm text-muted">אין לך הרשאת עריכה לתחום ההלכה.</p>
      )}

      <Card>
        <CardBody>
          <h2 className="font-display text-lg">היסטוריית גרסאות</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {rule.versions.map((v) => (
              <li key={v.id} className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">v{v.version}</Badge>
                  <span className="text-muted">{v.status} · {v.confidence}</span>
                  <span className="num ms-auto text-xs text-muted">
                    {new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(v.createdAt)}
                  </span>
                </div>
                {v.reason && <p className="mt-1 text-xs text-muted">סיבה: {v.reason}</p>}
                {v.author && <p className="text-xs text-muted">מאת: {v.author}</p>}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
