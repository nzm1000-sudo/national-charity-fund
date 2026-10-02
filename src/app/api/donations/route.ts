import { NextResponse } from "next/server";
import { createDonation, DonationError } from "@/server/donations";
import { createDonationSchema, fieldErrors } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request.headers, "donations"), 20, 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate_limited", message: "יותר מדי ניסיונות. נסו שוב בעוד רגע." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "bad_json", message: "בקשה לא תקינה." },
      { status: 400 },
    );
  }

  const parsed = createDonationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  try {
    const result = await createDonation(parsed.data, request.headers);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof DonationError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: 400 },
      );
    }
    console.error("[donations] create failed", err);
    return NextResponse.json(
      {
        error: "server_error",
        message: "לא הצלחנו להשלים את התשלום. לא חויבת. אפשר לנסות שוב.",
      },
      { status: 500 },
    );
  }
}
