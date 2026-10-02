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
      eyebrow="מסלול להשבה"
      title="השבת ממון"
      lead="מי שבידו ממון שאינו שלו, ואינו יודע כיצד להשיבו, ימצא כאן דרך מסודרת. השאלות קצרות, ואין צורך לפרט מה אירע."
      aside={
        <Card>
          <CardBody>
            <h2 className="mb-6 font-display text-xl">על פי ההלכה</h2>
            <HalachaNote fundType="restitution" />
          </CardBody>
        </Card>
      }
    >
      <RestitutionWizard fund={toFormFund(fund)} />
    </FlowShell>
  );
}
