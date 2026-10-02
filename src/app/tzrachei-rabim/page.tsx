import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFundContext } from "@/server/funds";
import { toFormFund } from "@/server/fund-form";
import { FlowShell } from "@/components/flows/flow-shell";
import { DonationForm } from "@/components/flows/donation-form";
import { HalachaNote } from "@/components/flows/halacha-note";
import { Card, CardBody } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "צרכי רבים",
  description:
    "לדברים שהציבור נהנה מהם באופן מתמשך — קטגוריה נפרדת מצדקה.",
};

export default async function PublicNeedsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const fund = await getFundContext("public_needs");
  if (!fund) notFound();
  const sp = await searchParams;
  const source = typeof sp.src === "string" ? sp.src : undefined;

  return (
    <FlowShell
      eyebrow="קטגוריה נפרדת"
      title="צרכי רבים"
      lead="לא אותה קטגוריה כמו צדקה. מדובר במיזמים מתמשכים שהציבור נהנה מהם — ולכן מתאימים גם להשבת ממון שאין לו בעלים ידועים. ההשבה נעשית בדיסקרטיות."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-3 font-display text-lg font-medium">הבסיס ההלכתי</h2>
            <HalachaNote fundType="public_needs" />
          </CardBody>
        </Card>
      }
    >
      <DonationForm
        fund={toFormFund(fund)}
        mode="public_needs"
        showCause
        source={source}
      />
    </FlowShell>
  );
}
