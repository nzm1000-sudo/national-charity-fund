import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { track } from "@/server/analytics";
import { rateLimit, clientKey } from "@/lib/rate-limit";

/**
 * QR short link: /q/<code> → tracked 302 redirect to the destination.
 * Scan counting is a plain increment; no visitor identity is stored.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const rl = rateLimit(clientKey(request.headers, "qr"), 60, 60_000);
  if (!rl.ok) return new NextResponse("יותר מדי סריקות", { status: 429 });

  const qr = await prisma.qrCode.findFirst({
    where: { OR: [{ code }, { slug: code }], active: true },
  });

  if (!qr) {
    return NextResponse.redirect(new URL("/?qr=unknown", request.url), 302);
  }

  await prisma.qrCode
    .update({ where: { id: qr.id }, data: { scanCount: { increment: 1 } } })
    .catch(() => undefined);

  await track({
    type: "qr_scan",
    qrId: qr.id,
    path: qr.destination,
    causeId: qr.causeId ?? undefined,
    campaignId: qr.campaignId ?? undefined,
    headers: request.headers,
  });

  const url = new URL(qr.destination, request.url);
  url.searchParams.set("src", qr.source ?? qr.slug);
  return NextResponse.redirect(url, 302);
}
