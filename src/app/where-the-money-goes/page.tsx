import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FUND_TYPES } from "@/lib/domain/fund-types";
import { formatILS } from "@/lib/money";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "לאן הכסף מגיע?",
  description: "שקיפות: מטרות, פרויקטים, התקדמות וסכומים — נתונים אמיתיים בלבד.",
};

export default async function WhereTheMoneyGoesPage() {
  const [causes, allocationsByCause, totalPaid, byFund] = await Promise.all([
    prisma.cause.findMany({ where: { publicVisible: true }, orderBy: { sortOrder: "asc" } }),
    prisma.allocation.groupBy({
      by: ["causeId"],
      where: { donation: { status: "paid" } },
      _sum: { amount: true },
    }),
    prisma.donation.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.allocation.groupBy({
      by: ["fundTypeCode"],
      where: { donation: { status: "paid" } },
      _sum: { amount: true },
    }),
  ]);

  const causeTotals = new Map(allocationsByCause.map((r) => [r.causeId, r._sum.amount ?? 0]));
  const fundTotals = new Map(byFund.map((r) => [r.fundTypeCode, r._sum.amount ?? 0]));
  const total = totalPaid._sum.amount ?? 0;

  return (
    <>
      <Section className="pt-10">
        <div className="container-page">
          <SectionHeading
            rule
            eyebrow="אמון ושקיפות"
            title="לאן הכסף מגיע?"
            lead="כל שקל משויך לסוג קופה ולמטרה, עם כלל הקצאה מתועד. אנחנו מציגים רק נתונים אמיתיים — גם כשהם עדיין קטנים."
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardBody>
                <p className="text-sm text-muted">סך תרומות שהושלמו</p>
                <p className="mt-1 font-display text-3xl">{formatILS(total)}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-muted">מספר פעולות</p>
                <p className="mt-1 num font-display text-3xl">{totalPaid._count}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <p className="text-sm text-muted">מטרות פעילות</p>
                <p className="mt-1 num font-display text-3xl">{causes.length}</p>
              </CardBody>
            </Card>
          </div>
        </div>
      </Section>

      {/* By fund type */}
      <Section className="border-y border-border bg-surface-2">
        <div className="container-page">
          <h2 className="text-2xl">פילוח לפי סוג קופה</h2>
          <p className="mt-2 text-sm text-muted">
            אין עירוב בין הקטגוריות. כל סוג קופה מוקצה בנפרד.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FUND_TYPES.filter((f) => f.code !== "general" && f.code !== "campaign").map((f) => (
              <li key={f.code} className="rounded-md border border-border bg-surface p-4">
                <p className="text-sm text-muted">{f.nameHe}</p>
                <p className="mt-1 font-display text-xl">
                  {formatILS(fundTotals.get(f.code) ?? 0)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Causes */}
      <Section>
        <div className="container-page">
          <h2 className="text-2xl">מטרות</h2>
          <p className="mt-2 text-sm text-muted">
            ניתן לתרום למטרה מסוימת, או להניח לנו להפנות למקום הדחוף ביותר.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {causes.map((c) => (
              <Card key={c.id}>
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium">{c.nameHe}</h3>
                    <Badge tone="neutral">{formatILS(causeTotals.get(c.id) ?? 0)}</Badge>
                  </div>
                  {c.summary && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.summary}</p>
                  )}
                  <Link
                    href={`/cause/${c.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-primary"
                  >
                    לתרום למטרה זו
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-surface-2">
        <div className="container-page flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl">רוצה לקחת חלק?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              בחר/י מסלול — או פשוט תרום/י ונסדיר את השאר.
            </p>
          </div>
          <ButtonLink href="/tzedakah" size="lg">
            לתרום עכשיו
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
