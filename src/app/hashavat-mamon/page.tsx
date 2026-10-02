import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFundContext } from "@/server/funds";
import { toFormFund } from "@/server/fund-form";
import { FlowShell } from "@/components/flows/flow-shell";
import { RestitutionWizard } from "@/components/flows/restitution-wizard";
import { HalachaNote } from "@/components/flows/halacha-note";
import { Card, CardBody } from "@/components/ui/card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "השבת ממון",
  description:
    "מסלול מסודר למי שיש בידו ממון שאינו שלו ואינו יודע למי להשיב.",
};

export default async function HashavatMamonPage() {
  const fund = await getFundContext("public_needs");
  if (!fund) notFound();

  return (
    <FlowShell
      eyebrow="המסלול המרכזי"
      title="השבת ממון"
      lead="יש כסף שאינך יודע למי להשיב? נברר יחד, בשקט, את הדרך הנכונה — בלי שתצטרך לספר מה קרה."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-3 font-display text-lg font-medium">הבסיס ההלכתי</h2>
            <HalachaNote fundType="restitution" />
          </CardBody>
        </Card>
      }
    >
      <RestitutionWizard fund={toFormFund(fund)} />
    </FlowShell>
  );
}
