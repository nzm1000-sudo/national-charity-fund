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
  title: "צדקה",
  description: "לתת צדקה לפי היכולת, למטרה שתבחרו — בדיסקרטיות.",
};

export default async function TzedakahPage() {
  const fund = await getFundContext("tzedakah");
  if (!fund) notFound();

  return (
    <FlowShell
      eyebrow="מסלול"
      title="צדקה"
      lead="בוחרים מטרה וסכום, ונותנים לפי היכולת. אפשר להישאר אנונימי, ואפשר לתת בסתר."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-3 font-display text-lg font-medium">הבסיס ההלכתי</h2>
            <HalachaNote fundType="tzedakah" />
          </CardBody>
        </Card>
      }
    >
      <DonationForm fund={toFormFund(fund)} mode="tzedakah" showCause />
    </FlowShell>
  );
}
