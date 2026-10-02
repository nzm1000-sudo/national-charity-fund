import { NextResponse } from "next/server";
import { getPaymentsProvider } from "@/server/payments";
import { completeDonation, failDonation } from "@/server/donations";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Payment provider webhook. Signature is verified before any state change.
 * Always return 200 for verified events so the provider does not retry forever.
 */
export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request.headers, "webhook"), 120, 60_000);
  if (!rl.ok) return NextResponse.json({ ok: false }, { status: 429 });

  const raw = await request.text();
  const signature = request.headers.get("x-signature");

  const provider = getPaymentsProvider();
  const event = provider.verifyWebhook(raw, signature);
  if (!event) {
    return NextResponse.json({ ok: false, error: "invalid_signature" }, { status: 401 });
  }

  if (event.status === "succeeded") {
    await completeDonation(event.providerRef, event.rawStatus);
  } else if (event.status === "failed") {
    await failDonation(event.providerRef);
  }

  return NextResponse.json({ ok: true });
}
