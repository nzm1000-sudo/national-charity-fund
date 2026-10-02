import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getPaymentsProvider } from "@/server/payments";
import { signMockWebhook } from "@/server/payments/mock";
import { completeDonation, failDonation } from "@/server/donations";

/**
 * Development-only endpoint that stands in for a PSP's hosted page result.
 * It signs a webhook body and runs it through the *real* verification path so
 * the production flow is exercised locally. Disabled outside the mock provider.
 */
export async function POST(request: Request) {
  if (env.PAYMENTS_PROVIDER !== "mock") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as
    | { ref?: string; outcome?: "success" | "fail" }
    | null;
  if (!body?.ref) {
    return NextResponse.json({ ok: false, error: "missing_ref" }, { status: 400 });
  }

  const payload = JSON.stringify({
    providerRef: body.ref,
    status: body.outcome === "fail" ? "failed" : "succeeded",
    type: "charge",
    rawStatus: body.outcome === "fail" ? "card_declined" : "approved",
  });
  const signature = signMockWebhook(payload, env.PAYMENTS_WEBHOOK_SECRET);

  const provider = getPaymentsProvider();
  const event = provider.verifyWebhook(payload, signature);
  if (!event) {
    return NextResponse.json({ ok: false, error: "verify_failed" }, { status: 500 });
  }

  if (event.status === "succeeded") {
    await completeDonation(event.providerRef, event.rawStatus);
  } else {
    await failDonation(event.providerRef);
  }

  return NextResponse.json({ ok: true, status: event.status });
}
