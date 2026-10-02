import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";

/**
 * Renders a QR code for a stored code as SVG (default) or PNG.
 * The QR always points at our own short URL so we can track + redirect.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "png" ? "png" : "svg";
  const size = Math.min(Math.max(Number(searchParams.get("size")) || 512, 128), 1024);

  const qr = await prisma.qrCode.findFirst({
    where: { OR: [{ code }, { slug: code }] },
  });
  const target = qr ? `${env.APP_URL}/q/${qr.slug}` : `${env.APP_URL}/`;
  const options = {
    width: size,
    margin: 2,
    errorCorrectionLevel: "M" as const,
    color: { dark: "#1a1814", light: "#ffffff" },
  };

  if (format === "png") {
    const buffer = await QRCode.toBuffer(target, { ...options, type: "png" });
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const svg = await QRCode.toString(target, { ...options, type: "svg" });
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
