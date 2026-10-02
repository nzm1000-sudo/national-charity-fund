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
  title: "פדיון נפש",
  description: "פדיון נפש כמנהג ישראל — עם שם ושם אם ונוסח מתאים.",
};

export default async function PidyonPage() {
  const fund = await getFundContext("pidyon_nefesh");
  if (!fund) notFound();

  return (
    <FlowShell
      eyebrow="מסלול נפרד"
      title="פדיון נפש"
      lead="פדיון נפש כמנהג ישראל. שם האדם ושם אמו, נוסח הבקשה ותרומה לצדקה כפי היכולת."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-6 font-display text-xl">על פי ההלכה</h2>
            <HalachaNote fundType="pidyon_nefesh" />
          </CardBody>
        </Card>
      }
    >
      <DonationForm fund={toFormFund(fund)} mode="pidyon" showCause showPidyon />
    </FlowShell>
  );
}
