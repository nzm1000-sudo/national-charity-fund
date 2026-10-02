import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFundContext } from "@/server/funds";
import { toFormFund } from "@/server/fund-form";
import { FlowShell } from "@/components/flows/flow-shell";
import { DonationForm } from "@/components/flows/donation-form";
import { Card, CardBody } from "@/components/ui/card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "מעשר כספים",
  description: "להפריש מעשר מההכנסה — עם מחשבון, מטרה ורצף לאורך זמן.",
};

export default async function MaaserPage() {
  const fund = await getFundContext("maaser");
  if (!fund) notFound();

  return (
    <FlowShell
      eyebrow="מסלול"
      title="מעשר כספים"
      lead="הפרשת מעשר מן ההכנסה, חישוב מדויק ומעקב לאורך השנה."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-6 font-display text-xl">על פי ההלכה</h2>
            <p className="text-[15px] leading-relaxed text-ink-soft">מעשר כספים הינה אחת המצוות היחידות שבה הקב״ה מתחייב לשפע ופרנסה לתורמים ולתורמות. זוהי פעולת נתינה מורכבת רגשית אך בתוכה קיימת עוצמה וכח אינסופיים. ״עשר בשביל שתתעשר״</p>
          </CardBody>
        </Card>
      }
    >
      <DonationForm fund={toFormFund(fund)} mode="maaser" showCause showMaaserCalc />
    </FlowShell>
  );
}
