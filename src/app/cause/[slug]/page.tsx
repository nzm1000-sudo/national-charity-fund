import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCauseBySlug, getFundContext } from "@/server/funds";
import { toFormFund } from "@/server/fund-form";
import { prisma } from "@/lib/prisma";
import { FlowShell } from "@/components/flows/flow-shell";
import { DonationForm } from "@/components/flows/donation-form";
import { Card, CardBody } from "@/components/ui/card";

export const revalidate = 300;

/** Pre-render one page per public cause (also required by static export). */
export async function generateStaticParams() {
  const causes = await prisma.cause
    .findMany({ where: { publicVisible: true, active: true }, select: { slug: true } })
    .catch(() => []);
  return causes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cause = await getCauseBySlug(slug);
  if (!cause) return { title: "מטרה" };
  return { title: cause.nameHe, description: cause.summary ?? undefined };
}

export default async function CausePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [cause, fund] = await Promise.all([
    getCauseBySlug(slug),
    getFundContext("tzedakah"),
  ]);
  if (!cause || !fund) notFound();

  return (
    <FlowShell
      eyebrow="מטרה"
      title={cause.nameHe}
      lead={cause.summary ?? undefined}
      aside={
        <Card>
          <CardBody>
            <h2 className="font-display text-lg font-medium">שקיפות</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              כל שקל שנתרם למטרה זו מתועד. נתוני ההתקדמות מוצגים באזור
              &quot;לאן הכסף מגיע&quot; — רק נתונים אמיתיים.
            </p>
          </CardBody>
        </Card>
      }
    >
      <DonationForm fund={toFormFund(fund)} mode="tzedakah" showCause defaultCauseSlug={slug} />
    </FlowShell>
  );
}
