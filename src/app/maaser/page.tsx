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
  title: "מעשר כספים",
  description: "להפריש מעשר מההכנסה — עם מחשבון, מטרה ורצף לאורך זמן.",
};

export default async function MaaserPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const fund = await getFundContext("maaser");
  if (!fund) notFound();
  const sp = await searchParams;
  const source = typeof sp.src === "string" ? sp.src : undefined;

  return (
    <FlowShell
      eyebrow="מסלול"
      title="מעשר כספים"
      lead="נהוג להפריש עשירית מההכנסה. אפשר לחשב לפי הכנסות ולהישאר עם מטרה קבועה."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-3 font-display text-lg font-medium">הבסיס ההלכתי</h2>
            <HalachaNote fundType="maaser" />
          </CardBody>
        </Card>
      }
    >
      <DonationForm
        fund={toFormFund(fund)}
        mode="maaser"
        showCause
        showMaaserCalc
        source={source}
      />
    </FlowShell>
  );
}
