import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFundContext } from "@/server/funds";
import { toFormFund } from "@/server/fund-form";
import { FlowShell } from "@/components/flows/flow-shell";
import { DonationForm } from "@/components/flows/donation-form";
import { HalachaNote } from "@/components/flows/halacha-note";
import { Card, CardBody } from "@/components/ui/card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "צרכי רבים",
  description:
    "לדברים שהציבור נהנה מהם באופן מתמשך — קטגוריה נפרדת מצדקה.",
};

export default async function PublicNeedsPage() {
  const fund = await getFundContext("public_needs");
  if (!fund) notFound();

  return (
    <FlowShell
      eyebrow="קופה נפרדת"
      title="צרכי רבים"
      lead="מפעלים שהציבור כולו נהנה מהם. היעד שקבעו חכמים לממון שבעליו אינם ידועים."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-6 font-display text-xl">על פי ההלכה</h2>
            <HalachaNote fundType="public_needs" />
          </CardBody>
        </Card>
      }
    >
      <DonationForm fund={toFormFund(fund)} mode="public_needs" showCause />
    </FlowShell>
  );
}
