import { NextResponse } from "next/server";
import { analyticsEventSchema } from "@/lib/validation";
import { track } from "@/server/analytics";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request.headers, "analytics"), 200, 60_000);
  if (!rl.ok) return new NextResponse(null, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = analyticsEventSchema.safeParse(body);
  if (!parsed.success) return new NextResponse(null, { status: 422 });

  await track({ ...parsed.data, headers: request.headers });
  return new NextResponse(null, { status: 204 });
}
