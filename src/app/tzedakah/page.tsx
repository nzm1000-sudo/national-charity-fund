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
      lead="בחירת יעד, סכום ותדירות. אפשר לתרום פעם אחת או מדי חודש, בשמך או בעילום שם."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-6 font-display text-xl">על פי ההלכה</h2>
            <HalachaNote fundType="tzedakah" />
          </CardBody>
        </Card>
      }
    >
      <DonationForm fund={toFormFund(fund)} mode="tzedakah" showCause />
    </FlowShell>
  );
}
