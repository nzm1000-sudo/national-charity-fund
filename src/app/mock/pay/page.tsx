import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { MockCheckout } from "@/components/flows/mock-checkout";
import { Section } from "@/components/ui/section";

export const dynamic = "force-dynamic";
export const metadata = { title: "תשלום (הדמיה)", robots: { index: false } };

export default async function MockPayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (env.PAYMENTS_PROVIDER !== "mock") notFound();
  const sp = await searchParams;
  const ref = typeof sp.ref === "string" ? sp.ref : "";
  const amount = Number(typeof sp.amount === "string" ? sp.amount : 0);
  const returnUrl = typeof sp.return === "string" ? sp.return : "/";

  if (!ref) notFound();

  return (
    <Section>
      <div className="container-page">
        <MockCheckout reference={ref} amountAgorot={amount} returnUrl={returnUrl} />
      </div>
    </Section>
  );
}
